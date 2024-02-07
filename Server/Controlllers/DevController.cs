using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using LedgerLinkPro.Database;
using LedgerLinkPro.Models.Users;
using LedgerLink_Pro_Backend.Services;

namespace Team_Tactics_Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
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

        
    }

}
