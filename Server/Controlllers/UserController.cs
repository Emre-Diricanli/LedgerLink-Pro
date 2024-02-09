using LedgerLink_Pro_Backend.DTO;
using LedgerLink_Pro_Backend.Models.Users;
using LedgerLink_Pro_Backend.Services;
using LedgerLinkPro.Database;
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

        //Get specific user

        //Update user

        //delete user



    }
}
