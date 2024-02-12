using LedgerLink_Pro_Backend.DTO;
using LedgerLink_Pro_Backend.Models.Users;
using LedgerLink_Pro_Backend.Services;
using LedgerLinkPro.Database;
using LedgerLinkPro.DTO;
using LedgerLinkPro.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

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
                        user.PasswordExpieration = PasswordExpiration.PasswordExpiration; //<= Date
                    }
                    else
                    {
                        user.PasswordExpieration = null;
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



    }
}
