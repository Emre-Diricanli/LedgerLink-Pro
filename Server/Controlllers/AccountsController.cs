using LedgerLinkPro.DTO;
using LedgerLinkPro.Models.Users;
using LedgerLinkPro.Services;
using LedgerLinkPro.Database;
using LedgerLinkPro.DTO;
using LedgerLinkPro.Models.Accounts;
using LedgerLinkPro.Models.Auth;
using LedgerLinkPro.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.Web;

namespace Team_Tactics_Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly IDbContextFactory<LedgerLinkProDBContext> _contextFactory;
        private readonly ErrorReportingService _errorReportingService;

        public AccountsController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IDbContextFactory<LedgerLinkProDBContext> contextFactory, IEmailService emailService, ErrorReportingService errorReportingService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _contextFactory = contextFactory;
            _emailService = emailService;
            _errorReportingService = errorReportingService;
        }

        public static int GetAccountNumber(string Category)
        {
            int AccountNumber = 0;
            switch (Category)
            {
                case "Assets":
                    AccountNumber = 1000;
                    break;
                case "Liabilities":
                    AccountNumber = 2000;
                    break;
                case "Equity":
                    AccountNumber = 3000;
                    break;
                case "Revenue":
                    AccountNumber = 4000;
                    break;
                case "Expenses":
                    AccountNumber = 5000;
                    break;
            }
            return AccountNumber;
        }


        [HttpPost("create-new-account")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> CreateNewAccount(NewAccountDTO newAccount)
        {
            try
            {
                //validate user
                var user = await _userManager.GetUserAsync(User);

                // Validate the model
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create a new account
                var account = new Account
                {
                    AccountName = newAccount.AccountName,
                    Description = newAccount.Description,
                    NormalSide = newAccount.NormalSide,
                    Category = newAccount.Category,
                    Subcategory = newAccount.Subcategory,
                    UserId = newAccount.UserId,

                    InitialBalance = 0,
                    ActiveStatus = true,
                    Debit = 0,
                    Credit = 0,
                    Balance = 0,
                    DateAdded = DateTimeOffset.Now,
                    Order = "",
                    Statement = "",
                    Comment = ""
                };

                //get the account number
                int accountPrefix = GetAccountNumber(account.Category);

                int accountNumber = accountPrefix + 10;

                //verify if the account number already exists
                using (var context = _contextFactory.CreateDbContext())
                {
                    var accountExists = await context.Accounts.FirstOrDefaultAsync(a => a.AccountNumber == accountNumber);
                    while (accountExists != null)
                    {
                        accountNumber += 10;
                        accountExists = await context.Accounts.FirstOrDefaultAsync(a => a.AccountNumber == accountNumber);
                    }
                }

                account.AccountNumber = accountNumber;

                // Save the account to the database
                using (var context = _contextFactory.CreateDbContext())
                {
                    context.Accounts.Add(account);
                    await context.SaveChangesAsync();
                }

                //return the account
                ReturnAccountDTO returnAccount = new ReturnAccountDTO
                {
                    AccountId = account.AccountId,
                    AccountName = account.AccountName,
                    AccountNumber = account.AccountNumber,
                    ActiveStatus = account.ActiveStatus,
                    Category = account.Category,
                    Comment = account.Comment,
                    Credit = account.Credit,
                    DateAdded = account.DateAdded,
                    Debit = account.Debit,
                    Description = account.Description,
                    InitialBalance = account.InitialBalance,
                    NormalSide = account.NormalSide,
                    Order = account.Order,
                    Statement = account.Statement,
                    Subcategory = account.Subcategory,
                    UserId = account.UserId
                };

                return Ok(returnAccount);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                //null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error creating new account. Exception Catched",  "AccountsController.cs", "UNKNOWN", "CreateNewAccount", ex.Message);
                }

                await _errorReportingService.ReportError("Error creating new account. Exception Catched",  "AccountsController.cs", identityUser.Id, "CreateNewAccount", ex.Message);

                return StatusCode(500, "Error creating new account");
            }
        }

        [HttpPost("deactivate-account/{accountId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeactivateAccount(Guid accountId)
        {
            try
            {
                // Validate user
                var user = await _userManager.GetUserAsync(User);

                // Get the account
                using (var context = _contextFactory.CreateDbContext())
                {
                    var account = await context.Accounts.FirstOrDefaultAsync(a => a.AccountId == accountId);
                    if (account == null)
                    {
                        return BadRequest("Account not found");
                    }

                    // Deactivate the account
                    account.ActiveStatus = false;

                    // Save changes to the database
                    context.Accounts.Update(account);
                    await context.SaveChangesAsync();
                }

                return Ok("Account deactivated successfully");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error deactivating account. Exception Catched", "AccountsController.cs", "UNKNOWN", "DeactivateAccount", ex.Message);
                }

                await _errorReportingService.ReportError("Error deactivating account. Exception Catched", "AccountsController.cs", identityUser.Id, "DeactivateAccount", ex.Message);

                return StatusCode(500, "Error deactivating account");
            }
        }
    
    
    
    }

}
