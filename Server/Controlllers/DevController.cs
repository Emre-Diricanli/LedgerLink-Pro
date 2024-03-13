using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using LedgerLinkPro.Database;
using LedgerLinkPro.Models.Users;
using LedgerLinkPro.Services;

namespace Team_Tactics_Backend.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class DevController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly IDbContextFactory<LedgerLinkProDBContext> _contextFactory;

        public DevController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IDbContextFactory<LedgerLinkProDBContext> contextFactory, IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _contextFactory = contextFactory;
            _emailService = emailService;
        }

        [HttpPost("dev-delete-all")]
        public async Task<IActionResult> DeleteAll()
        {
            try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    context.Database.EnsureDeleted();
                    context.Database.EnsureCreated();
                }


                return Ok("All data has been deleted");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("dev-unlock-accounts")]
        public async Task<IActionResult> UnlockAccounts()
        {
            try
            {
                //foreach account in the database, unlock the account
                var _context = _contextFactory.CreateDbContext();

                var users = _userManager.Users.ToList();

                foreach (var user in users)
                {
                    await _userManager.SetLockoutEnabledAsync(user, false);
                    //reset lockiout end date
                    await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.Now);
                    await _userManager.ResetAccessFailedCountAsync(user);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("dev/admin/register-sample")]
        public async Task<IActionResult> RegisterSampleAdmin()
        {
            try
            {
                var sampleUserName = "jdoe" + DateTime.Now.ToString("MMyy");
                var sampleEmail = "aj132@icloud.com";

                // Create a sample admin user
                var identUser = new IdentityUser
                {
                    UserName = sampleUserName,
                    Email = sampleEmail,
                    EmailConfirmed = true // Bypassing email confirmation for development
                };

                var identRegistrationResult = await _userManager.CreateAsync(identUser, "Password123$");
                if (!identRegistrationResult.Succeeded) return BadRequest(identRegistrationResult.Errors);

                // Add user to role
                var roleResult = await _userManager.AddToRoleAsync(identUser, "Admin");
                if (!roleResult.Succeeded)
                {
                    await _userManager.DeleteAsync(identUser);
                    return BadRequest(roleResult.Errors);
                }

                // Assuming direct usage of the User entity like in your original code
                var user = new User
                {
                    id = identUser.Id,
                    Username = identUser.UserName,
                    FirstName = "John",
                    LastName = "Doe",
                    UserRole = 3, // Assuming Admin
                    IsActive = true // Bypassing the activation process for development
                };

                using (var db = _contextFactory.CreateDbContext())
                {
                    db.Users.Add(user);
                    await db.SaveChangesAsync();
                }

                return Ok(new { Message = "Sample admin created successfully", UserName = sampleUserName, Email = sampleEmail });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

    }

}
