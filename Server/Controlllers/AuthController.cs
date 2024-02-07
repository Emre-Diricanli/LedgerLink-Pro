using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using LedgerLinkPro.Database;
using LedgerLinkPro.Models.Users;
using LedgerLink_Pro_Backend.Services;
using System.Web;
using LedgerLink_Pro_Backend.DTO;

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

            
            using var db = _contextFactory.CreateDbContext();
            using var transaction = await db.Database.BeginTransactionAsync();  
            try
            {
                //Verify information is present
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
                    await _userManager.DeleteAsync(identuser); // Might not be necessary if transaction is rolled back
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

                db.Users.Add(user);
                await db.SaveChangesAsync();

                // Generate and send confirmation token
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(identuser);
                var codeEncoded = HttpUtility.UrlEncode(token);
                await _emailService.SendEmailAsync(model.Email, "Confirm your email", $"Please confirm your email by clicking this link: <a href='https://localhost:5001/auth/confirm-email?email={model.Email}&token={codeEncoded}'>Confirm Email</a>");

                await transaction.CommitAsync(); // Commit transaction if all operations succeed
                return Ok();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(); // Rollback transaction in case of an error
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

                    //get object from NeedsCreateNewPassword table
                    var needsCreateNewPassword = await db.NeedsCreateNewPasswords.FirstOrDefaultAsync(u => u.Email == model.Email);
                    if (needsCreateNewPassword == null)
                    {
                        return BadRequest("User not found");
                    }

                    if (needsCreateNewPassword.InitialPassword)
                    {
                        //return 429 status code to indicate user needs to change password
                        return StatusCode(4298, "User needs to change password"); //428 = Precondition Required
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
        public async Task<IActionResult> ConfirmEmail([FromQuery] string email, [FromQuery] string token)
        {
            try
            {
                if (email == null || token == null)
                {
                    return BadRequest("No information was provided");
                }

                var user = await _userManager.FindByEmailAsync(email);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                // Decode the token from URL
                var tokenDecoded = HttpUtility.UrlDecode(token);

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

    }

}
