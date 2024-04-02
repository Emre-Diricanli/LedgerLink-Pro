using LedgerLinkPro.DTO;
using LedgerLinkPro.Models.Users;
using LedgerLinkPro.Services;
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
using LedgerLinkPro.DTO.User;

namespace LedgerLinkPro.Controlllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly IDbContextFactory<LedgerLinkProDBContext> _contextFactory;
        private readonly IConfiguration _configuration; // IConfiguration dependency
        private readonly ErrorReportingService _errorReportingService;

        public UserController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IDbContextFactory<LedgerLinkProDBContext> contextFactory, IEmailService emailService, IConfiguration configuration, ErrorReportingService errorReportingService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _contextFactory = contextFactory;
            _emailService = emailService;
            _configuration=configuration;
            _errorReportingService = errorReportingService;
        }

        [HttpGet("get-my-info")]
        [Authorize]
        public async Task<IActionResult> GetMyInfo()
        {
            try
            {
                // Get the user
                var identUser = await _userManager.GetUserAsync(User);

                if (identUser == null)
                {
                    return BadRequest("User not found");
                }

                var returnModel = await GetUserDetailsAsync(identUser.Id);

                return Ok(returnModel);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
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
                var validUser = await ValidateUser(User);

                if (!validUser)
                {
                    return Unauthorized("You are not authorized to perform this action");
                }

                // Verify pageSize and pageIndex are positive, else set to default values
                pageSize = pageSize > 0 ? pageSize : 10;
                pageIndex = pageIndex > 0 ? pageIndex : 1;

                // Verify if the user is an admin
                if (!User.IsInRole("Admin"))
                {
                    return Unauthorized("You are not authorized to perform this action");
                }

                using var db = _contextFactory.CreateDbContext();
                IQueryable<User> usersQuery = db.Users;

                if (!string.IsNullOrWhiteSpace(searchString))
                {
                    // Normalize the searchString to ensure consistent comparison (e.g., trimming and converting to lowercase).
                    var normalizedSearchString = searchString.Trim().ToLower();

                    usersQuery = usersQuery.Where(u =>
                        (u.LastName.ToLower() + " " + u.FirstName.ToLower()).Contains(normalizedSearchString) ||
                        (u.FirstName.ToLower() + " " + u.LastName.ToLower()).Contains(normalizedSearchString));
                }


                // Apply active status filter
                switch (activeStatus)
                {
                    case 0:
                        usersQuery = usersQuery.Where(u => !u.IsActive);
                        break;
                    case 1:
                        usersQuery = usersQuery.Where(u => u.IsActive);
                        break;
                    default:
                        //if 2 then return all users (do nothing)
                        break;
                }

                //apply user type filter
                switch (userType)
                {
                    case 1:
                        usersQuery = usersQuery.Where(u => u.UserRole == 1);
                        break;
                    case 2:
                        usersQuery = usersQuery.Where(u => u.UserRole == 2);
                        break;
                    case 3:
                        usersQuery = usersQuery.Where(u => u.UserRole == 3);
                        break;
                    default:
                        //if 0 then return all users (do nothing)
                        break;
                }

                var users = usersQuery
                    .Skip((pageIndex - 1) * pageSize)
                    .Take(pageSize);

                var usersList = new List<UserInfoReturnModel>();

                foreach (var user in users)
                {
                    var userDetails = await GetUserDetailsAsync(user.id);
                    if (userDetails != null)
                    {
                        usersList.Add(userDetails);
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
                    case "User":
                        var role = await _userManager.AddToRolesAsync(identuser, new string[] { "User" });
                        break;
                    case "Manager":
                        var role2 = await _userManager.AddToRolesAsync(identuser, new string[] { "Manager" });
                        break;
                    case "Admin":
                        var role3 = await _userManager.AddToRolesAsync(identuser, new string[] { "Admin" });
                        break;
                    default:
                        return BadRequest("Invalid role");
                }

                var roleNum = newUser.role == "User" ? 1 :
                              newUser.role == "Manager" ? 2 :
                              newUser.role == "Admin" ? 3 : 0;

                var user = new User
                {
                    id = identuser.Id,
                    Username = identuser.UserName,
                    FirstName = newUser.firstName,
                    LastName = newUser.lastName,
                    UserRole = roleNum,
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

                //TODO change link based if they are admin or not
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
                    <p>To log in to your account, please visit the <a href='http://localhost:5173/user-signin'>login page</a>.</p>
                    <p>If you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
                    <p>Best regards,<br/>The LedgerLinkPro Team</p>
                </body>
                </html>";

                await _emailService.SendEmailAsync(newUser.email, "Welcome to LedgerLink Pro22", htmlContent);

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("admin/update-user-information")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> AdminUpdateUserInformation([FromBody] UserInfoReturnModel model)
        {
            try
            {
                //Update user table, identuser info, role info, ident user locked status,
                //verify model is not null
                if (model == null)
                {
                    return BadRequest("No user information was provided");
                }

                //verify model is valid
                

                var thisUser = await _userManager.GetUserAsync(User);

                if (thisUser == null)
                {
                    return BadRequest("User not found");
                }

                // Find the user
                var _context = _contextFactory.CreateDbContext();

                var user = await _context.Users.Where(u => u.id == model.userId).FirstOrDefaultAsync();
                var identUser = await _userManager.FindByIdAsync(model.userId);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                // Update the username on user and identuser
                user.Username = model.username;
                
                identUser.UserName = model.username;

                //compare email to see if it has changed
                if (identUser.Email != model.email)
                {
                    //update email
                    identUser.Email = model.email;

                    //update email in needsCreateNewPassword table
                    var needsCreateNewPassword = await _context.NeedsCreateNewPasswords.Where(u => u.Email == identUser.Email).FirstOrDefaultAsync();

                    if (needsCreateNewPassword != null)
                    {
                        needsCreateNewPassword.Email = model.email;
                    }
                }

                //update user info
                user.FirstName = model.firstName;
                user.LastName = model.lastName;

                //update user role
                var roles = await _userManager.GetRolesAsync(identUser);

                //compare role to see if it has changed
                if (roles[0] != model.role)
                {
                    //remove user from old role
                    var removeRoles = await _userManager.RemoveFromRolesAsync(identUser, roles);

                    //add user to new role
                    var role = await _userManager.AddToRolesAsync(identUser, new string[] { model.role });

                    //update user role in user table
                    user.UserRole = model.role == "User" ? 1 :
                                   model.role == "Manager" ? 2 :
                                   model.role == "Admin" ? 3 : 1;
                }

                //update user active status
                user.IsActive = model.isActive;

                //save changes
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("admin/deactivate-user")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> AdminDeactivateUser([FromQuery] string userId)
        {
            try
            {
                // Find the user
                var _context = _contextFactory.CreateDbContext();
                var user = await _context.Users.Where(u => u.id == userId).FirstOrDefaultAsync();

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                // Deactivate the user
                user.IsActive = false;

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("admin/deactivate-multiple-users")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> AdminDeactivateMultipleUsers([FromBody] MultipleUserActionsModel users)
        {
            try
            {
                //verify userIds is not null
                if (users == null)
                {
                    return BadRequest("No user ids were provided");
                }

                var db = _contextFactory.CreateDbContext();

                foreach(var userToDeactivateId in users.userIds)
                {
                    var userToDeactivate = await db.Users.Where(u => u.id == userToDeactivateId).FirstOrDefaultAsync();

                    if (userToDeactivate == null)
                    {
                        return BadRequest("User not found");
                    }

                    // Deactivate the user
                    userToDeactivate.IsActive = false;
                }

                await db.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("admin/delete-user")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> AdminDeleteUser([FromQuery] string userId)
        {
            try
            {
                // Find the user
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                //gather  from users, needsCreateNewPassword, passwordExpirations, previousUsedPasswords, and userLoginHistories
                using var db = _contextFactory.CreateDbContext();

                var userToDelete = await db.Users.Where(u => u.id == userId).FirstOrDefaultAsync();
                var needsCreateNewPassword = await db.NeedsCreateNewPasswords.Where(u => u.Email == user.Email).FirstOrDefaultAsync();
                var passwordExpiration = await db.PasswordExpirations.Where(u => u.UserId == userId).FirstOrDefaultAsync();
                var previousUsedPasswords = await db.PreviousUsedPasswords.Where(u => u.UserId == userId).ToListAsync();
                var userLoginHistories = await db.UserLoginHistories.Where(u => u.userId == userId).ToListAsync();
                var userExpireAccess = await db.UserExpireAccesses.Where(u => u.userId == userId).ToListAsync();

                db.Users.Remove(userToDelete);
                db.NeedsCreateNewPasswords.Remove(needsCreateNewPassword);
                //null check for passwordExpiration
                if (passwordExpiration != null)
                {
                    db.PasswordExpirations.Remove(passwordExpiration);
                }

                if (userExpireAccess.Count > 0)
                {
                    db.UserExpireAccesses.RemoveRange(userExpireAccess);
                }

                db.PreviousUsedPasswords.RemoveRange(previousUsedPasswords);
                db.UserLoginHistories.RemoveRange(userLoginHistories);
                    
                await db.SaveChangesAsync();

                //check if user has a profile picture url
                var userProfilePictureLocation = await db.UserProfilePictureLocations.Where(u => u.UserId == userId).FirstOrDefaultAsync();

                if (userProfilePictureLocation != null)
                {
                    //Remove the old profile picture from Azure Blob Storage
                    var response = await DeleteUserProfilePicture(userProfilePictureLocation.ProfilePictureLocation);

                    //if the response is not an OkObjectResult, return BadRequest
                    if (response! is OkObjectResult okResult)
                    {
                        //report error
                        await _errorReportingService.ReportError("Error deleting profile picture", "UserController.cs", userId, "AdminDeleteUser", "Error deleting profile picture from Azure blob when attempting to delete user");
                    }
                    else
                    {
                        //remove the user's profile picture location
                        db.UserProfilePictureLocations.Remove(userProfilePictureLocation);
                    }
                }

                //remove user from roles
                var roles = await _userManager.GetRolesAsync(user);

                var removeRoles = await _userManager.RemoveFromRolesAsync(user, roles);

                // Delete the user
                var result = await _userManager.DeleteAsync(user);

                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("admin/delete-multiple-users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminDeleteMultipleUsers([FromBody] MultipleUserActionsModel users)
        {
            try
            {
                //verify userIds is not null
                if (users == null)
                {
                    return BadRequest("No user ids were provided");
                }

                //verify user 
                var thisUser = await _userManager.GetUserAsync(User);

                if (thisUser == null)
                {
                    return BadRequest("User not found");
                }

                var db = _contextFactory.CreateDbContext();

                foreach(var userToDeleteId in users.userIds)
                {
                    var identUser = await _userManager.FindByIdAsync(userToDeleteId);
                    var userToDelete = await db.Users.Where(u => u.id == userToDeleteId).FirstOrDefaultAsync();
                    var needsCreateNewPassword = await db.NeedsCreateNewPasswords.Where(u => u.Email == identUser.Email).FirstOrDefaultAsync();
                    var passwordExpiration = await db.PasswordExpirations.Where(u => u.UserId == userToDeleteId).FirstOrDefaultAsync();
                    var previousUsedPasswords = await db.PreviousUsedPasswords.Where(u => u.UserId == userToDeleteId).ToListAsync();
                    var userLoginHistories = await db.UserLoginHistories.Where(u => u.userId == userToDeleteId).ToListAsync();
                    var userExpireAccess = await db.UserExpireAccesses.Where(u => u.userId == userToDeleteId).ToListAsync();

                    db.Users.Remove(userToDelete);
                    if (needsCreateNewPassword != null)
                    {
                        db.NeedsCreateNewPasswords.Remove(needsCreateNewPassword);
                    }
                    //null check for passwordExpiration
                    if (passwordExpiration != null)
                    {
                        db.PasswordExpirations.Remove(passwordExpiration);
                    }

                    if (userExpireAccess.Count > 0)
                    {
                        db.UserExpireAccesses.RemoveRange(userExpireAccess);
                    }

                    db.PreviousUsedPasswords.RemoveRange(previousUsedPasswords);
                    db.UserLoginHistories.RemoveRange(userLoginHistories);

                    await db.SaveChangesAsync();

                    //check if user has a profile picture url
                    var userProfilePictureLocation = await db.UserProfilePictureLocations.Where(u => u.UserId == userToDeleteId).FirstOrDefaultAsync();

                    if (userProfilePictureLocation != null)
                    {
                        //Remove the old profile picture from Azure Blob Storage
                        var response = await DeleteUserProfilePicture(userProfilePictureLocation.ProfilePictureLocation);

                        //if the response is not an OkObjectResult, return BadRequest
                        if (response! is OkObjectResult okResult)
                        {
                            //report error
                            await _errorReportingService.ReportError("Error deleting profile picture", "UserController.cs", userToDeleteId, "AdminDeleteUser", $"Error deleting profile picture from Azure blob when attempting to delete user. User id is the person attempting to be deleted. Requesting user is {thisUser.Id}");
                        }
                        else
                        {
                            //remove the user's profile picture location
                            db.UserProfilePictureLocations.Remove(userProfilePictureLocation);
                        }
                    }

                    //remove user from roles
                    var roles = await _userManager.GetRolesAsync(identUser);

                    var removeRoles = await _userManager.RemoveFromRolesAsync(identUser, roles);

                    // Delete the user
                    var result = await _userManager.DeleteAsync(identUser);

                    if (!result.Succeeded)
                    {
                        return BadRequest(result.Errors);
                    }
                }

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("admin/activate-user")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> AdminActivateUser([FromQuery] string userId)
        {
            try
            {
                // Find the user
                var _context = _contextFactory.CreateDbContext();
                var user = await _context.Users.Where(u => u.id == userId).FirstOrDefaultAsync();

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                // Activate the user
                user.IsActive = true;

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("admin/activate-multiple-users")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> AdminActivateMultipleUsers([FromBody] MultipleUserActionsModel users)
        {
            try
            {
                //verify userIds is not null
                if (users == null)
                {
                    return BadRequest("No user ids were provided");
                }

                var db = _contextFactory.CreateDbContext();

                foreach(var userToActivateId in users.userIds)
                {
                    var userToActivate = await db.Users.Where(u => u.id == userToActivateId).FirstOrDefaultAsync();

                    if (userToActivate == null)
                    {
                        return BadRequest("User not found");
                    }

                    // Activate the user
                    userToActivate.IsActive = true;
                }

                await db.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("admin/reset-user-password")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> AdminResetUserPassword([FromBody] AdminResetUserPassword newUserResetPassword)
        {
            try
            {
                // Verify the model is valid
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Find the user
                var user = await _userManager.FindByIdAsync(newUserResetPassword.userId);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                // update the user's password
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, newUserResetPassword.password);

                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                //if expirePassword is true, then ensure user is required to change password on signin
                if (newUserResetPassword.expirePassword)
                {
                    using var db = _contextFactory.CreateDbContext();
                    var needsCreateNewPassword = new NeedsCreateNewPassword
                    {
                        Email = user.Email,
                        InitialPassword = true
                    };

                    db.NeedsCreateNewPasswords.Add(needsCreateNewPassword);
                    await db.SaveChangesAsync();
                }
                else
                {
                    using var db = _contextFactory.CreateDbContext();
                    DateTime utcNow = DateTime.UtcNow;
                    var passwordExpiration = new PasswordExpirationInfo
                    {
                        UserId = user.Id,
                        PasswordExpiration = utcNow.AddDays(90)
                    };

                    //remove password expiration if it exists
                    var existingPasswordExpiration = await db.PasswordExpirations.Where(u => u.UserId == user.Id).FirstOrDefaultAsync();

                    if (existingPasswordExpiration != null)
                    {
                        db.PasswordExpirations.Remove(existingPasswordExpiration);
                    }

                    db.PasswordExpirations.Add(passwordExpiration);
                    await db.SaveChangesAsync();

                    var passwordHash = _userManager.PasswordHasher.HashPassword(user, newUserResetPassword.password);

                    var passwordHistory = new PreviousUsedPasswords
                    {
                        UserId = user.Id,
                        PasswordHash = passwordHash
                    };

                    db.PreviousUsedPasswords.Add(passwordHistory);
                    await db.SaveChangesAsync();
                }


                var identUser = await _userManager.GetUserAsync(User);

                var adminsName = await _contextFactory.CreateDbContext().Users.Where(u => u.id == identUser.Id).Select(u => u.FirstName + u.LastName).FirstOrDefaultAsync();

                var htmlContent = $@"
                <!DOCTYPE html>
                <html lang=""en"">
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                    <title>Password Reset Notification</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                        .container {{ width: 80%; margin: auto; padding: 20px; }}
                        .button {{ background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; text-decoration: none; }}
                    </style>
                </head>
                <body>
                    <div class=""container"">
                        <h2>Password Reset Successful</h2>
                        <p>Hello,</p>
                        <p>Your password has been successfully reset by an admin. Below is your new and update password</p>
                        <p><strong>New Password:</strong> {newUserResetPassword.password}</p>
                        <p>The sytstem may prompt you to change your password upon loggin in.</p>
                        <a href=""http://localhost:5173/user-signin"" class=""button"">Log In Now</a>
                        <p>Best regards,<br>{adminsName}</p>
                    </div>
                </body>
                </html>
                ";

                //email user informing them of the password reset and provide them their new password
                await _emailService.SendEmailAsync(user.Email, "Your Password has Been Reset", htmlContent);

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("admin/create-user-access-expiration")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> CreateUserAccessExpiration([FromBody] NewUserAccessExpirationModel newUserExpirationModel)
        {
            try
            {
                // Verify the model is valid
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Find the user
                var user = await _userManager.FindByIdAsync(newUserExpirationModel.userId);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                var identUser = await _userManager.GetUserAsync(User);

                string assigneeId = "";

                if(identUser != null)
                {
                    assigneeId = identUser.Id;
                }

                var startDate = DateTime.Parse(newUserExpirationModel.expireStartDate); 
                var endDate = DateTime.Parse(newUserExpirationModel.expireEndDate);

                var startDateUtc = startDate.ToUniversalTime();
                var endDateUtc = endDate.ToUniversalTime();

                // Create a new entry in UserExpireAccess
                var userAccessExpiration = new UserExpireAccess
                {
                    expireId = Guid.NewGuid(),
                    userId = newUserExpirationModel.userId,
                    expireStartDate = startDateUtc,
                    expireEndDate = endDateUtc,
                    reason = newUserExpirationModel.reason,
                    assignedByUserId = assigneeId
                };

                using var db = _contextFactory.CreateDbContext();

                db.UserExpireAccesses.Add(userAccessExpiration);

                await db.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("admin/delete-user-access-expiration")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> DeleteUserAccessExpiration([FromQuery] Guid expireId)
        {
            try
            {
                // Find the user
                var userAccess = await _contextFactory.CreateDbContext().UserExpireAccesses.Where(u => u.expireId == expireId).FirstOrDefaultAsync();

                if (userAccess == null)
                {
                    return BadRequest("User access expiration not found");
                }

                using var db = _contextFactory.CreateDbContext();

                db.UserExpireAccesses.Remove(userAccess);

                await db.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("profile-picture-url")]
        [Authorize]
        public async Task<IActionResult> GetUserProfilePictureURL()
        {
            try
            {
                var identUser = await _userManager.GetUserAsync(User);
                var _context = _contextFactory.CreateDbContext();
                var user = await _context.UserProfilePictureLocations.Where(u => u.UserId == identUser.Id).FirstOrDefaultAsync();

                if (user == null)
                {
                    return Ok(new { profilePictureLocation = "UNKNOWN" });
                }

                return Ok(new { url = user.ProfilePictureLocation });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get-user-profile-picture-url")]
        [Authorize]
        public async Task<IActionResult> GetUserProfilePictureURL([FromQuery] string userId)
        {
            try
            {
                var _context = _contextFactory.CreateDbContext();
                var user = await _context.UserProfilePictureLocations.Where(u => u.UserId == userId).FirstOrDefaultAsync();

                if (user == null)
                {
                    return Ok(new { profilePictureLocation = "UNKNOWN" });
                }

                return Ok(new { url = user.ProfilePictureLocation });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("add-user-profile-picture-url")]
        [Authorize]
        public async Task<IActionResult> UploadProfilePictureUrl([FromBody] string url)
        {
            try
            {

                //find the user
                var identUser = await _userManager.GetUserAsync(User);

                //if the user is not found, return BadRequest
                if (identUser == null)
                {
                    return BadRequest("User not found");
                }

                var _context = _contextFactory.CreateDbContext();

                //check if user already has a profile picture
                var userProfilePictureLocation = await _context.UserProfilePictureLocations.Where(u => u.UserId == identUser.Id).FirstOrDefaultAsync();

                if (userProfilePictureLocation != null)
                {
                    //Remove the old profile picture from Azure Blob Storage
                    var response = await DeleteUserProfilePicture(userProfilePictureLocation.ProfilePictureLocation);

                    //if the response is not an OkObjectResult, return BadRequest
                    if (response! is OkObjectResult okResult)
                    {
                        return BadRequest("Error deleting profile picture");
                    }
                    else
                    {
                        //refresh context. Do this because we deleted the old profile picture from Azure Blob Storage and need to update the location in the databases otheriwse its tracking two entities under the same UserId (PK)
                        _context = _contextFactory.CreateDbContext();

                        //update the user's profile picture location
                        UserProfilePictureLocations newLocation = new UserProfilePictureLocations
                        {
                            UserId = identUser.Id,
                            ProfilePictureLocation = url
                        };

                        await _context.UserProfilePictureLocations.AddAsync(newLocation);

                        await _context.SaveChangesAsync();
                    }
                }
                else
                {
                    //create a new entry in the UserProfilePictureLocations table
                    UserProfilePictureLocations newlocation = new UserProfilePictureLocations
                    {
                        UserId = identUser.Id,
                        ProfilePictureLocation = url
                    };

                    //add the new location
                    _context.UserProfilePictureLocations.Add(newlocation);
                    await _context.SaveChangesAsync();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete-user-profile-picture")]
        [Authorize]
        public async Task<IActionResult> DeleteUserProfilePicture([FromBody] string url)
        {
            try
            {
                //find the user
                var identUser = await _userManager.GetUserAsync(User);

                if (identUser == null)
                {
                    return BadRequest("User not found");
                }                
                //remove the user's profile picture from Azure Blob Storage
                //create a new instance of AzureBlobService
                AzureBlobService azureBlobService = new AzureBlobService(_userManager, _signInManager, _contextFactory, _emailService, _configuration);

                //delete using the url
                IActionResult response = await azureBlobService.DeleteProfilePictureByUrl(url);

                if (response is OkObjectResult okResult)
                {
                    //remove the user's profile picture location in database
                    var _context = _contextFactory.CreateDbContext();
                    var userProfilePictureLocation = await _context.UserProfilePictureLocations.Where(u => u.UserId == identUser.Id).FirstOrDefaultAsync();

                    if (userProfilePictureLocation != null)
                    {
                        _context.UserProfilePictureLocations.Remove(userProfilePictureLocation);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        //report error
                        await _errorReportingService.ReportError("Error deleting profile picture", "UserController.cs", identUser.Id, "DeleteUserProfilePicture", $"Error deleting profile picture from SQL db after successful delete from Azure Blob. URL: {url} ");
                        return Ok("There was a problem deleting the profile picture. It appears that the image has been removed from storage but the changes were not made in the database. This may cause future issues.");
                    }

                    return Ok();
                } 
                else
                {
                    return BadRequest("Error deleting profile picture");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }


        [HttpGet("accountants")]
        [Authorize]
        public async Task<IActionResult> GetAccounants()
        {
            try
            {
                // Verify user
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                //get all accountants
                var _context = _contextFactory.CreateDbContext();

                var accountants = await _context.Users.Where(u => u.UserRole == 1).ToListAsync();

                if (accountants == null)
                {
                    return Ok();
                }

                //Convert to SimpleUserInfoReturnModel
                List<SimpleUserInfoModel> accountantsList = new List<SimpleUserInfoModel>();

                foreach (var accountant in accountants)
                {
                    var identUser = await _userManager.FindByIdAsync(accountant.id);

                    if (identUser == null)
                    {
                        continue;

                    }

                    SimpleUserInfoModel model = new SimpleUserInfoModel
                    {
                        Username = identUser.UserName,
                        Email = identUser.Email,
                        FullName = accountant.FirstName + " " + accountant.LastName

                    };

                    accountantsList.Add(model);
                }
                
                //return accountants
                return Ok(accountants);


            }
            catch(Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("managers")]
        [Authorize]
        public async Task<IActionResult> GetManagers()
        {
            try
            {
                // Verify user
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                //get all managers
                var _context = _contextFactory.CreateDbContext();

                var managers = await _context.Users.Where(u => u.UserRole == 2).ToListAsync();

                if (managers == null)
                {
                    return Ok();
                }

                //Convert to SimpleUserInfoReturnModel
                List<SimpleUserInfoModel> managersList = new List<SimpleUserInfoModel>();

                foreach (var manager in managers)
                {
                    var identUser = await _userManager.FindByIdAsync(manager.id);

                    if (identUser == null)
                    {
                        continue;
                    }

                    SimpleUserInfoModel model = new SimpleUserInfoModel
                    {
                        Username = identUser.UserName,
                        Email = identUser.Email,
                        FullName = manager.FirstName + " " + manager.LastName

                    };

                    managersList.Add(model);
                }

                //return managers
                return Ok(managersList);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        private async Task<string> ReturnUserFullName(string id)
        {
            try
            {
                var _context = _contextFactory.CreateDbContext();
                var user = await _context.Users.Where(u => u.id == id).FirstOrDefaultAsync();

                if (user == null)
                {
                    return "UNKNOWN";
                }

                return user.FirstName + " " + user.LastName;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return null;
            }
        }
    
        private async Task<bool> ValidateUser(System.Security.Claims.ClaimsPrincipal user)
        {
            try
            {
                var result = await _userManager.GetUserAsync(user);

                if (result == null)
                {
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return false;
            }
        }

        private async Task<UserInfoReturnModel> GetUserDetailsAsync(string userId)
        {
            var _context = _contextFactory.CreateDbContext();
            var identUser = await _userManager.FindByIdAsync(userId);
            if (identUser == null) return null;

            var user = await _context.Users.Where(u => u.id == userId).FirstOrDefaultAsync();

            if (user == null) return null;

            var userModel = new UserInfoReturnModel
            {
                userId = identUser.Id,
                username = identUser.UserName,
                email = identUser.Email,
                confirmedEmail = identUser.EmailConfirmed,
                firstName = user.FirstName,
                lastName = user.LastName,
                role = user.UserRole == 1 ? "User" :
                       user.UserRole == 2 ? "Manager" :
                       user.UserRole == 3 ? "Admin" : "UNKNOWN",
                isActive = user.IsActive,
            };

            // Last login and last 5 logins
            var lastLogin = await _context.UserLoginHistories
                .Where(u => u.userId == userId)
                .OrderByDescending(u => u.loginTime)
                .FirstOrDefaultAsync();

            if (lastLogin != null)
            {
                userModel.lastLogin = lastLogin.loginTime;
                var last5Logins = await _context.UserLoginHistories
                    .Where(u => u.userId == userId)
                    .OrderByDescending(u => u.loginTime)
                    .Take(5)
                    .Select(u => u.loginTime)
                    .ToListAsync();

                userModel.last5Logins = last5Logins;
            }

            // Password expiration logic
            var passwordExpiration = await _context.PasswordExpirations
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (passwordExpiration != null)
            {
                userModel.passwordExpiration = passwordExpiration.PasswordExpiration;
            }

            // User access expiration info logic
            // Similar to the provided code

            // Locked out and access failed count logic
            userModel.lockedOut = await _userManager.IsLockedOutAsync(identUser);
            if (userModel.lockedOut)
            {
                var lockoutEndDate = await _userManager.GetLockoutEndDateAsync(identUser);
                userModel.lockoutEnd = lockoutEndDate?.LocalDateTime;
            }

            userModel.accessFailedCount = await _userManager.GetAccessFailedCountAsync(identUser);

            userModel.profilePictureUrl = await _context.UserProfilePictureLocations
                .Where(u => u.UserId == userId)
                .Select(u => u.ProfilePictureLocation)
                .FirstOrDefaultAsync();

            return userModel;
        }

    }
}
