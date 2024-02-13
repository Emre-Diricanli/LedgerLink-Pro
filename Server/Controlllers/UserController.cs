using LedgerLink_Pro_Backend.DTO;
using LedgerLink_Pro_Backend.Models.Users;
using LedgerLink_Pro_Backend.Services;
using LedgerLinkPro.Database;
using LedgerLinkPro.DTO;
using LedgerLinkPro.Models.Auth;
using LedgerLinkPro.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.Web;

namespace LedgerLink_Pro_Backend.Controlllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly IDbContextFactory<LedgerLinkProDBContext> _contextFactory;

        public UserController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IDbContextFactory<LedgerLinkProDBContext> contextFactory, IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _contextFactory = contextFactory;
            _emailService = emailService;
        }

        //Create a new user as admin
        [HttpPost("admin/register-user")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminRegisterUser([FromBody] AdminRegisterUserModel model)
        {
            using var db = _contextFactory.CreateDbContext();
            using var transaction = await db.Database.BeginTransactionAsync();
            try
            {
                //Verify information is present
                if (model == null)
                {
                    return BadRequest("No information was provided");
                }

                // Verify the model is valid
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create a new user
                var identuser = new IdentityUser
                {
                    //username is first letter of first name, last name + month in (mm) and year (yy) of registration (today)
                    UserName = model.FirstName.Substring(0, 1).ToLower() + model.LastName.ToLower() + DateTime.Now.ToString("MMyy"),
                    Email = model.Email,
                    EmailConfirmed = false
                };

                // Register the user
                //two letters of firstname + two letters of last name + year to date
                string userPassword = model.FirstName.Substring(2) + model.LastName.Substring(2) + DateTime.Now.ToString("yy");
                var identRegistrationResult = await _userManager.CreateAsync(identuser, userPassword);

                if (!identRegistrationResult.Succeeded)
                {
                    return BadRequest(identRegistrationResult.Errors);
                }

                // Add user to role
                var role = await _userManager.AddToRolesAsync(identuser, new string[] { "User" });

                if (!role.Succeeded)
                {
                    return BadRequest(role.Errors);
                }

                var user = new User
                {
                    id = identuser.Id,
                    Username = identuser.UserName,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    UserRole = model.Role, //Role based on admin's selection
                    IsActive = true //true since admin is creating the user
                };

                //Create new entry in NeedsCreateNewPassword table to signal user to change password on signin
                var needsCreateNewPassword = new NeedsCreateNewPassword
                {
                    Email = model.Email,
                    InitialPassword = true
                };

                db.Users.Add(user);
                db.NeedsCreateNewPasswords.Add(needsCreateNewPassword);
                await db.SaveChangesAsync();

                //Send email to user
                await _emailService.SendEmailAsync(model.Email, "Welcome to LedgerLink Pro", $"Your username is {identuser.UserName} and your password is {userPassword}. Please login and change your password.");

                await transaction.CommitAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        //Get all users
        [HttpGet("admin/get-users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsers([FromQuery] int pageSize, [FromQuery] int pageIndex, [FromQuery] int userType, [FromQuery] int activeStatus, [FromQuery] string searchString = "")
        {
            try
            {
                // Verify pageSize and pageIndex are positive, else set to default values
                pageSize = pageSize > 0 ? pageSize : 10;
                pageIndex = pageIndex > 0 ? pageIndex : 1;

                // Verify if the user is an admin
                if (!User.IsInRole("Admin"))
                {
                    return Unauthorized("You are not authorized to perform this action");
                }

                using var db = _contextFactory.CreateDbContext();
                //var usersQuery = db.Users
                //.Where(u => u.UserRole == userType && (u.Username.Contains(searchString) || u.FirstName.Contains(searchString) || u.LastName.Contains(searchString)));
                IQueryable<User> usersQuery = db.Users;
                //var usersTest = await usersQuery.ToListAsync();

                // Apply active status filter
                switch (activeStatus)
                {
                    case 1:
                        usersQuery = usersQuery.Where(u => u.IsActive);
                        break;
                    case 2:
                        usersQuery = usersQuery.Where(u => !u.IsActive);
                        break;
                }

                var users = usersQuery
                    .Skip((pageIndex - 1) * pageSize)
                    .Take(pageSize);


                // Return as a list of UserInfoReturnModel
                var usersList = await users.Select(u => new UserInfoReturnModel
                {
                    UserId = u.id,
                    Username = u.Username,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    IsActive = u.IsActive,
                    StreetAddress = u.StreetAddress,
                    City = u.City,
                    State = u.State,
                    ZipCode = u.ZipCode,
                    PhoneNumber = u.PhoneNumber,
                    Role = u.UserRole == 1 ? "User" :
                           u.UserRole == 2 ? "Manager" :
                           u.UserRole == 3 ? "Admin" : "Unknown"
                }).ToListAsync();

                //Gather role, confirmed email, last login, password expiration, and password reset information
                foreach (var user in usersList)
                {
                    var identUser = await _userManager.FindByIdAsync(user.UserId);
                    user.ConfirmedEmail = identUser.EmailConfirmed;

                    var lastLogin = await db.UserLoginHistories.Where(u => u.userId == user.UserId).OrderByDescending(u => u.loginTime).FirstOrDefaultAsync();

                    //null check
                    if (lastLogin != null)
                    {
                        user.LastLogin = lastLogin.loginTime;

                        //gather the last 5 logins
                        var last5Logins = await db.UserLoginHistories.Where(u => u.userId == user.UserId).OrderByDescending(u => u.loginTime).Take(5).Select(u => u.loginTime).ToListAsync();

                        user.Last5Logins = last5Logins;
                    }
                    else
                    {
                        user.LastLogin = null;
                    }

                    //password expiration
                    var PasswordExpiration = await db.PasswordExpirations.Where(u => u.UserId == user.UserId).FirstOrDefaultAsync();

                    //null check
                    if (PasswordExpiration != null)
                    {
                        user.PasswordExpiration = PasswordExpiration.PasswordExpiration; //<= Date
                    }
                    else
                    {
                        user.PasswordExpiration = null;
                    }
                }

                return Ok(usersList);

            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        //Get specific user

        //Update user

        //delete user

        //validate username
        [HttpGet("validate-username")]
        [Authorize]
        public async Task<IActionResult> ValidateUsername([FromQuery] string username)
        {
            try
            {
                // verify a username is present in the query
                if (string.IsNullOrEmpty(username))
                {
                    return BadRequest("No username was provided");
                }

                //check if username is already taken
                var user = await _userManager.FindByNameAsync(username);

                if (user != null)
                {
                    return Ok(new {valid = false});
                }
                else
                {
                    return Ok(new {valid = true});
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("validate-email")]
        [Authorize]
        public async Task<IActionResult> ValidateEmail([FromQuery] string email)
        {
            try
            {
                // verify a username is present in the query
                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest("No username was provided");
                }

                //regex on email
                if (!Regex.IsMatch(email, @"^[\w\.-]+@[\w\-]+\.[\w\.-]+$"))
                {
                    return BadRequest("Invalid email format");
                }

                //check if username is already taken
                var user = await _userManager.FindByEmailAsync(email);

                if (user != null)
                {
                    return Ok(new { valid = false });
                }
                else
                {
                    return Ok(new { valid = true });
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("admin/create-user")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> AdminCreateNewUser([FromBody] AdminNewUserModel newUser)
        {
            try
            {
                // Verify the model is valid
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create a new user
                var identuser = new IdentityUser
                {
                    UserName = newUser.username,
                    Email = newUser.email,
                    EmailConfirmed = false
                };

                // Register the user
                var identRegistrationResult = await _userManager.CreateAsync(identuser, newUser.password);

                if (!identRegistrationResult.Succeeded)
                {
                    return BadRequest(identRegistrationResult.Errors);
                }

                // Add user to role
                switch (newUser.role)
                {
                    case 1:
                        var role = await _userManager.AddToRolesAsync(identuser, new string[] { "User" });
                        break;
                    case 2:
                        var role2 = await _userManager.AddToRolesAsync(identuser, new string[] { "Manager" });
                        break;
                    case 3:
                        var role3 = await _userManager.AddToRolesAsync(identuser, new string[] { "Admin" });
                        break;
                    default:
                        return BadRequest("Invalid role");
                }

                var user = new User
                {
                    id = identuser.Id,
                    Username = identuser.UserName,
                    FirstName = newUser.firstName,
                    LastName = newUser.lastName,
                    UserRole = newUser.role,
                    IsActive = true
                };

                using var db = _contextFactory.CreateDbContext();
                db.Users.Add(user);

                //if password equals initial password (Password123$), create new entry in NeedsCreateNewPassword table to signal user to change password on signin otherwise , create new entry in PasswordExpirations table and add to previous password history
                if (newUser.password.Equals("Password123$"))
                {
                    var needsCreateNewPassword = new NeedsCreateNewPassword
                    {
                        Email = newUser.email,
                        InitialPassword = true
                    };

                    db.NeedsCreateNewPasswords.Add(needsCreateNewPassword);
                }
                else
                {
                    var passwordExpiration = new PasswordExpirationInfo
                    {
                        UserId = identuser.Id,
                        PasswordExpiration = DateTime.Now.AddDays(90)
                    };

                    db.PasswordExpirations.Add(passwordExpiration);

                   var passwordHash = _userManager.PasswordHasher.HashPassword(identuser, newUser.password);

                    var passwordHistory = new PreviousUsedPasswords
                    {
                        UserId = identuser.Id,
                        PasswordHash = passwordHash
                    };

                    db.PreviousUsedPasswords.Add(passwordHistory);
                }

                await db.SaveChangesAsync();


                //Send email to user
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(identuser);
                var codeEncoded = HttpUtility.UrlEncode(token);
                var username = identuser.UserName; // Extract the username from the IdentityUser object
                var confirmationLink = $"http://localhost:5173/admin-confirm-email?email={HttpUtility.UrlEncode(newUser.email)}&token={codeEncoded}";

                var htmlContent = $@"
                <html>
                <body>
                    <h1>Welcome to LedgerLinkPro!</h1>
                    <p>Hello {user.FirstName},</p>
                    <p>Welcome to LedgerLinkPro. We're excited to have you on board. Your account has been successfully created, and you're almost ready to start using your new account.</p>
                    <p>To begin using your account please confirm your email by following the link below:</p>
                    <p><a href='{confirmationLink}'>Confirm Email</a></p> 
                    <h2>Your account details are as follows:</h2>
                    <ul>
                        <li><strong>Username:</strong> {newUser.username}</li>
                        <li><strong>Password:</strong> {newUser.password}</li>
                    </ul>
                    <p><strong>Please change your password after logging in.</strong></p>
                    <p>To log in to your account, please visit the <a href='http://localhost:5173/login'>login page</a>.</p>
                    <p>If you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
                    <p>Best regards,<br/>The LedgerLinkPro Team</p>
                </body>
                </html>";

                await _emailService.SendEmailAsync(newUser.email, "Welcome to LedgerLink Pro", htmlContent);

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

    }
}
