using LedgerLink_Pro_Backend.Models.Util;
using LedgerLinkPro.Database;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace LedgerLink_Pro_Backend.Services
{
    public class ErrorReportingService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly IDbContextFactory<LedgerLinkProDBContext> _contextFactory;

        public ErrorReportingService(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IDbContextFactory<LedgerLinkProDBContext> contextFactory, IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _contextFactory = contextFactory;
            _emailService = emailService;
        }

        public async Task ReportError(string errorMessage, string filePath, string userid, string methodName, string otherDetails)
        {
            try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    var reportedError = new ReportedErrors
                    {
                        ErrorMessage = errorMessage,
                        FilePath = filePath,
                        UserId = userid,
                        MethodName = methodName,
                        OtherDetails = otherDetails,
                        DateReported = DateTimeOffset.Now
                    };

                    context.ReportedErrors.Add(reportedError);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }
        }

    }
}
