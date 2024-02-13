using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using LedgerLinkPro.Database;
using LedgerLinkPro.Models.Users;
using LedgerLink_Pro_Backend.Services;
using System.Web;
using LedgerLink_Pro_Backend.DTO;
using Microsoft.AspNetCore.Authorization;
using LedgerLinkPro.DTO;
using LedgerLinkPro.Models.Auth;
using LedgerLink_Pro_Backend.Models.Users;
using LedgerLinkPro;

namespace Team_Tactics_Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly IDbContextFactory<LedgerLinkProDBContext> _contextFactory;

        public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IDbContextFactory<LedgerLinkProDBContext> contextFactory, IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _contextFactory = contextFactory;
            _emailService = emailService;
        }

        [HttpPost("admin/register")]
        public async Task<IActionResult> Register([FromBody] AdminRegisterModel model)
        {
            try
            {
                // Verify information is present
                if (model == null) return BadRequest("No information was provided");

                // Verify the model is valid
                if (!ModelState.IsValid) return BadRequest(ModelState);

                // Create a new user
                var identuser = new IdentityUser
                {
                    UserName = model.FirstName.Substring(0, 1).ToLower() + model.LastName.ToLower() + DateTime.Now.ToString("MMyy"),
                    Email = model.Email,
                    EmailConfirmed = false
                };

                var identRegistrationResult = await _userManager.CreateAsync(identuser, model.Password);
                if (!identRegistrationResult.Succeeded) return BadRequest(identRegistrationResult.Errors);

                // Add user to role
                var roleResult = await _userManager.AddToRoleAsync(identuser, "Admin");
                if (!roleResult.Succeeded)
                {
                    await _userManager.DeleteAsync(identuser);
                    return BadRequest(roleResult.Errors);
                }

                // Additional operations with your custom User entity
                var user = new User
                {
                    id = identuser.Id,
                    Username = identuser.UserName,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    UserRole = 3, // Assuming Admin
                    IsActive = false // false until email is confirmed
                };

                using (var db = _contextFactory.CreateDbContext())
                {
                    db.Users.Add(user);

                    //Add Password Expiration record
                    DateTime utcNow = DateTime.UtcNow;
                    var passwordExpiration = new PasswordExpirationInfo
                    {
                        UserId = identuser.Id,
                        PasswordExpiration = utcNow.AddMonths(3)
                    };

                    await db.SaveChangesAsync();
                }

                // Generate and send confirmation token
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(identuser);
                var codeEncoded = HttpUtility.UrlEncode(token);
                var username = identuser.UserName; // Extract the username from the IdentityUser object
                var confirmationLink = $"http://localhost:5173/admin-confirm-email?email={HttpUtility.UrlEncode(model.Email)}&token={codeEncoded}";

                var htmlContent = $@"
                    <html>
                        <body>
                            <h1>Welcome, {username}!</h1>
                            <p>Thank you for registering as an admin. Before you can start using your account, you need to confirm your email address.</p>
                            <p>Please click the link below to confirm your email:</p>
                            <p><a href='{confirmationLink}'>Confirm Email</a></p>
                            <p>If you did not register for an account, no further action is required.</p>
                        </body>
                    </html>";

                await _emailService.SendEmailAsync(model.Email, "Confirm your email", htmlContent);

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("user/login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel model)
        {
            try
            {
                if (model == null) return BadRequest("No information was provided");

                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

                if (!result.Succeeded)
                {
                    return BadRequest("Invalid email or password");
                }

                //check if user needs to change password
                using (var db = _contextFactory.CreateDbContext())
                {
                    //get identity user
                    var identityUser = await _userManager.FindByNameAsync(model.Email);

                    var usersEmail = identityUser.Email;

                    //get object from NeedsCreateNewPassword table
                    var needsCreateNewPassword = await db.NeedsCreateNewPasswords.FirstOrDefaultAsync(u => u.Email == usersEmail);
                    if (needsCreateNewPassword == null)
                    {
                        return BadRequest("User not found");
                    }

                    if (needsCreateNewPassword.InitialPassword)
                    {
                        //return 429 status code to indicate user needs to change password
                        //genereate new password token
                        var token = await _userManager.GeneratePasswordResetTokenAsync(await _userManager.FindByNameAsync(model.Email));

                        // Encode the token for URL
                        var codeEncoded = HttpUtility.UrlEncode(token);

                        return Ok(new { status = 428, token = codeEncoded, id = identityUser.Id });
                    }

                    //TODO: Implement password expiration checks

                    //if passed all checks then report login
                    var user = await _userManager.FindByNameAsync(model.Email);
                    var lastLogin = new UserLoginHistory
                    {
                        userId = user.Id,
                        loginTime = DateTime.Now
                    };

                    db.UserLoginHistories.Add(lastLogin);
                    await db.SaveChangesAsync();
                }

                return Ok(new { userNeedsPasswordReset = false });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("admin/login")]
        public async Task<IActionResult> AdminLogin([FromBody] UserLoginModel model)
        {
            try
            {
                if (model == null) return BadRequest("No information was provided");

                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

                if (!result.Succeeded)
                {
                    return BadRequest("Invalid email or password");
                }

                var _context = _contextFactory.CreateDbContext();

                DateTime utcNow = DateTime.UtcNow;

                //log admin login
                var user = await _context.Users.Where(u => u.Username == model.Email).FirstOrDefaultAsync();
                var lastLogin = new UserLoginHistory
                {
                    userId = user.id,
                    loginTime = utcNow
                };

                _context.UserLoginHistories.Add(lastLogin);
                await _context.SaveChangesAsync();

                return Ok();

            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("role")]
        public async Task<IActionResult> GetRole()
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);

                // Verify the user is valid
                if (user == null) return Unauthorized("User not found");

                var role = await _userManager.GetRolesAsync(user);

                // Verify the role is valid and return as json 'role' property
                if (role == null) return Ok(new { role = 1 });


                return Ok(new { role = ReturnRole(role[0]) });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("user/request-access")]
        public async Task<IActionResult> UserRequestAccess([FromBody] UserRequestAccessModel model)
        {
            try
            {
                // Verify information is present
                if (model == null) return BadRequest("No information was provided");

                // Verify the model is valid
                if (!ModelState.IsValid) return BadRequest(ModelState);

                Random rand = new Random();
                int randId = rand.Next(100, 999);
                UserToBeApproved user = new UserToBeApproved
                {
                    Email = model.email,
                    GeneratedPassword = "Password" + DateTime.Now.ToString("MMyy") + "$", // Password is "Password" + current month and year + "$"
                    Username = model.firstname.Substring(0, 1).ToLower() + model.lastname.ToLower() + randId, //first letter of first name + last name + random 3 digit number
                    FirstName = model.firstname,
                    LastName = model.lastname,
                    DOB = model.dob.ToString("yyyy-MM-dd"),
                    StreetAddress = model.streetaddress,
                    City = model.city,
                    State = model.state,
                    ZipCode = model.zipcode,
                    ApptNumber = model.apptnumber
                };

                using (var db = _contextFactory.CreateDbContext())
                {
                    db.UsersToBeApproved.Add(user);
                    await db.SaveChangesAsync();
                }

                var adminsToEmail = await _userManager.GetUsersInRoleAsync("Admin");


                //email admins to approve user
                var emailBody = $@"
                    <html>
                    <head>
                        <style>
                            .button {{display: inline-block;
                                padding: 10px 20px;
                                font-size: 16px;
                                cursor: pointer;
                                text-align: center;
                                text-decoration: none;
                                outline: none;
                                color: #fff;
                                background-color: #4CAF50;
                                border: none;
                                border-radius: 15px;
                                box-shadow: 0 9px #999;
                            }}

                            .button:hover {{background - color: #3e8e41
                                }}

                            .button:active {{background - color: #3e8e41;
                                box-shadow: 0 5px #666;
                                transform: translateY(4px);
                            }}
                        </style>
                    </head>
                    <body>
                        <p>A user is requesting access to the system with the following details:</p>
                        <ul>
                            <li>Email: {model.email}</li>
                            <li>Username: {user.Username}</li>
                            <li>Name: {model.firstname} {model.lastname}</li>
                            <li>Date of Birth: {user.DOB}</li>
                            <li>Address: {model.streetaddress}, {model.apptnumber}, {model.city}, {model.state}, {model.zipcode}</li>
                        </ul>
                        <a href='http://localhost:5173/confirm-user/?name={model.firstname + " " + model.lastname}&email={model.email}&username={user.Username}' class='button'>Confirm User</a>
                    </body>
                    </html>
                    ";

                foreach (var admin in adminsToEmail)
                {
                    await _emailService.SendEmailAsync(admin.Email, "A user is requesting access", emailBody);
                }

                return Ok();

            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("confirm-user-access")]
        public async Task<IActionResult> ConfirmUserAccess([FromQuery] string email)
        {
            try
            {
                // Verify information is present
                if (email == null) return BadRequest("No information was provided");

                //find user by email
                var _context = _contextFactory.CreateDbContext();
                var user = await _context.UsersToBeApproved.FirstOrDefaultAsync(u => u.Email == email);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                // Create a new user
                var identuser = new IdentityUser
                {
                    UserName = user.Username,
                    Email = user.Email,
                    EmailConfirmed = true
                };

                var identRegistrationResult = await _userManager.CreateAsync(identuser, user.GeneratedPassword);

                var newPasswordHistory = new PreviousUsedPasswords
                {
                    UserId = identuser.Id,
                    PasswordHash = _userManager.PasswordHasher.HashPassword(identuser, user.GeneratedPassword)
                };

                _context.PreviousUsedPasswords.Add(newPasswordHistory);
                await _context.SaveChangesAsync();

                if (!identRegistrationResult.Succeeded) return BadRequest(identRegistrationResult.Errors);

                // Add user to role
                var roleResult = await _userManager.AddToRoleAsync(identuser, "User");

                if (!roleResult.Succeeded)
                {
                    await _userManager.DeleteAsync(identuser);
                    return BadRequest(roleResult.Errors);
                }

                // Additional operations with your custom User entity
                var newUser = new User
                {
                    id = identuser.Id,
                    Username = identuser.UserName,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    StreetAddress = user.StreetAddress,
                    City = user.City,
                    State = user.State,
                    ZipCode = user.ZipCode,
                    UserRole = 1, // Assuming User
                    IsActive = true
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                //auto confirm email, setNeedsCreateNewPassword to true and delete user from UsersToBeApproved table
                identuser = await _userManager.FindByEmailAsync(email);
                await _userManager.ConfirmEmailAsync(identuser, await _userManager.GenerateEmailConfirmationTokenAsync(identuser));

                var needsCreateNewPassword = new NeedsCreateNewPassword
                {
                    Email = email,
                    InitialPassword = true
                };

                _context.NeedsCreateNewPasswords.Add(needsCreateNewPassword);
                _context.UsersToBeApproved.Remove(user);

                await _context.SaveChangesAsync();

                var htmlContent = $@"
                <html>
                <body>
                    <h1>Welcome to LedgerLinkPro!</h1>
                    <p>Hello {user.FirstName},</p>
                    <p>Welcome to LedgerLinkPro. We're excited to have you on board. Your account has been successfully created, and you're almost ready to start using your new account.</p>
                    <h2>Your account details are as follows:</h2>
                    <ul>
                        <li><strong>Username:</strong> {user.Username}</li>
                        <li><strong>Password:</strong> {user.GeneratedPassword}</li>
                    </ul>
                    <p><strong>Please change your password after logging in.</strong></p>
                    <p>To log in to your account, please visit the <a href='http://localhost:5173/login'>login page</a>.</p>
                    <p>If you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
                    <p>Best regards,<br/>The LedgerLinkPro Team</p>
                </body>
                </html>";

                await _emailService.SendEmailAsync(email, "Welcome to LedgerLinkPro", htmlContent);


                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        //TODO: Implement transaction rollback in case of an error
        [HttpPost("admin/forgot-password")]
        public async Task<IActionResult> AdminForgotPassword([FromBody] string email)
        {
            try
            {
                //verify information is present
                if (email == null)
                {
                    return BadRequest("No information was provided");
                }

                //find user by email
                var user = await _userManager.FindByEmailAsync(email);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                //generate token
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                // Encode the token for URL
                var codeEncoded = HttpUtility.UrlEncode(token);

                //send reset password email
                await _emailService.SendEmailAsync(email, "Reset your password", "Please reset your password by clicking this link: <a href='https://localhost:5001/auth/reset-password?email=" + email + "&token=" + codeEncoded + "'>Reset Password</a>");

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        //TODO: Implement transaction rollback in case of an error
        [HttpPost("admin/reset-password")]
        public async Task<IActionResult> AdminResetPassword([FromBody] string email)
        {
            try
            {
                //verify information is present
                if (email == null)
                {
                    return BadRequest("No information was provided");
                }

                //find user by email
                var user = await _userManager.FindByEmailAsync(email);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                //generate token
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                // Encode the token for URL
                var codeEncoded = HttpUtility.UrlEncode(token);

                //send reset password email
                await _emailService.SendEmailAsync(email, "Reset your password", "Please reset your password by clicking this link: <a href='https://localhost:5001/auth/reset-password?email=" + email + "&token=" + codeEncoded + "'>Reset Password</a>");

                return Ok();

            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        //TODO: Implement transaction rollback in case of an error
        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] EmailConfirmationModel emailConfirmationModel)
        {
            try
            {
                if (emailConfirmationModel.email == null || emailConfirmationModel.token == null)
                {
                    return BadRequest("No information was provided");
                }

                var user = await _userManager.FindByEmailAsync(emailConfirmationModel.email);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                // Decode the token from URL
                var tokenDecoded = HttpUtility.UrlDecode(emailConfirmationModel.token);

                // Then use the decoded token in ConfirmEmailAsync
                var result = await _userManager.ConfirmEmailAsync(user, tokenDecoded);


                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                using (var db = _contextFactory.CreateDbContext())
                {
                    var userToUpdate = await db.Users.FirstOrDefaultAsync(u => u.id == user.Id);
                    if (userToUpdate == null)
                    {
                        return BadRequest("User not found");
                    }
                    userToUpdate.IsActive = true;
                    db.Users.Update(userToUpdate);
                    await db.SaveChangesAsync();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> UpdatePassword([FromBody] PasswordChangeModel newModel)
        {
            try
            {
                //verify information is present
                if (newModel == null)
                {
                    return BadRequest("No information was provided");
                }

                //get user
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                //verify that password is not reused
                if (IsPasswordReused(user.Id, newModel.newpassword))
                {
                    return BadRequest("Password has been used before");
                }

                //Change password
                var result = await _userManager.ChangePasswordAsync(user, newModel.oldPassword, newModel.newpassword);

                //if password change is successful, add old password to PreviousUsedPasswords table
                if (result.Succeeded)
                {
                    using (var db = _contextFactory.CreateDbContext())
                    {
                        var oldPassword = new PreviousUsedPasswords
                        {
                            UserId = user.Id,
                            PasswordHash = _userManager.PasswordHasher.HashPassword(user, newModel.newpassword)
                        };

                        db.PreviousUsedPasswords.Add(oldPassword);
                        await db.SaveChangesAsync();

                        //assuming user has changed password, set InitialPassword to false and update password expiration date
                        var needsCreateNewPassword = await db.NeedsCreateNewPasswords.FirstOrDefaultAsync(u => u.Email == user.Email);
                        if (needsCreateNewPassword == null)
                        {
                            //do nothing
                        }
                        else
                        {
                            needsCreateNewPassword.InitialPassword = false;
                            db.NeedsCreateNewPasswords.Update(needsCreateNewPassword);
                            await db.SaveChangesAsync();
                        }

                        var PasswordExpiration = await db.PasswordExpirations.FirstOrDefaultAsync(u => u.UserId == user.Id);
                        if (PasswordExpiration == null)
                        {
                            //create new password expiration record
                            var newPasswordExpiration = new PasswordExpirationInfo
                            {
                                UserId = user.Id,
                                PasswordExpiration = DateTime.Now.AddMonths(3)
                            };

                            db.PasswordExpirations.Add(newPasswordExpiration);
                            await db.SaveChangesAsync();
                        }
                        else
                        {
                            PasswordExpiration.PasswordExpiration = DateTime.Now.AddMonths(3);
                            db.PasswordExpirations.Update(PasswordExpiration);
                            await db.SaveChangesAsync();
                        }
                    }
                }

                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Error: " + ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("new-user/reset-password")]
        public async Task<IActionResult> NewUserResetPassword([FromBody] NewUserResetPasswordModel model)
        {
            try
            {
                //verify information is present
                if (model == null)
                {
                    return BadRequest("No information was provided");
                }

                //get user by id
                var user = await _userManager.FindByIdAsync(model.userid);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                //verify that password is not reused
                if (IsPasswordReused(user.Id, model.newpassword))
                {
                    return Conflict("Password has been used before");
                }


                var _context = _contextFactory.CreateDbContext();


                //TODO FIX TOKEN ISSUE
                var fakeToken = await _userManager.GeneratePasswordResetTokenAsync(user);

                //Change password
                var result = await _userManager.ResetPasswordAsync(user, fakeToken, model.newpassword);

                //if password change is successful, add old password to PreviousUsedPasswords table
                if (result.Succeeded)
                {
                    var currentPassword = new PreviousUsedPasswords
                    {
                        UserId = user.Id,
                        PasswordHash = _userManager.PasswordHasher.HashPassword(user, model.newpassword)
                    };

                    _context.PreviousUsedPasswords.Add(currentPassword);

                    //assuming user has changed password, set InitialPassword to false and update password expiration date
                    var needsCreateNewPassword = await _context.NeedsCreateNewPasswords.FirstOrDefaultAsync(u => u.Email == user.Email);
                    if (needsCreateNewPassword == null)
                    {
                        //do nothing
                    }
                    else
                    {
                        needsCreateNewPassword.InitialPassword = false;
                        _context.NeedsCreateNewPasswords.Update(needsCreateNewPassword);
                    }

                    var PasswordExpiration = await _context.PasswordExpirations.FirstOrDefaultAsync(u => u.UserId == user.Id);
                    if (PasswordExpiration == null)
                    {
                        DateTime utcnow = DateTime.UtcNow;
                        utcnow = utcnow.AddMonths(3);

                        //create new password expiration record
                        var newPasswordExpiration = new PasswordExpirationInfo
                        {
                            UserId = user.Id,
                            PasswordExpiration = utcnow
                        };

                        _context.PasswordExpirations.Add(newPasswordExpiration);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        PasswordExpiration.PasswordExpiration = DateTime.Now.AddMonths(3);
                        _context.PasswordExpirations.Update(PasswordExpiration);
                        await _context.SaveChangesAsync();
                    }
                }

                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                //sign user in
                await _signInManager.SignInAsync(user, false);

                DateTime utcnow2 = DateTime.UtcNow;

                //log user login
                var lastLogin = new UserLoginHistory
                {
                    userId = user.Id,
                    loginTime = utcnow2
                };

                _context.UserLoginHistories.Add(lastLogin);
                await _context.SaveChangesAsync();


                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("online-status")]
        public async Task<IActionResult> CheckOnlineStatus()
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }


        private bool IsPasswordReused(string userId, string newPassword)
        {
            var user = _userManager.FindByIdAsync(userId).Result;
            var passwordHasher = _userManager.PasswordHasher;

            var _context = _contextFactory.CreateDbContext();

            var oldPasswords = _context.PreviousUsedPasswords

                .Where(op => op.UserId == userId)
                .Select(op => op.PasswordHash)
                .ToList();

            foreach (var oldPasswordHash in oldPasswords)
            {
                var verificationResult = passwordHasher.VerifyHashedPassword(user, oldPasswordHash, newPassword);
                if (verificationResult == PasswordVerificationResult.Success)
                {
                    return true; // The new password matches one of the old passwords
                }
            }

            return false; // The new password does not match any of the old passwords
        }

        private int ReturnRole(string role)
        {
            switch (role)
            {
                case "Admin":
                    return 3;
                case "Manager":
                    return 2;
                case "User":
                    return 1;
                default:
                    return 1;
            }
        }
    }
}
