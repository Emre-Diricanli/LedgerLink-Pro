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
using LedgerLinkPro.DTO.Accounts;

namespace LedgerLinkPro.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
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
                case "Asset":
                    AccountNumber = 1000;
                    break;
                case "Liabillity":
                    AccountNumber = 2000;
                    break;
                case "Equity":
                    AccountNumber = 3000;
                    break;
                case "Revenue":
                    AccountNumber = 4000;
                    break;
                case "Expense":
                    AccountNumber = 5000;
                    break;
            }
            return AccountNumber;
        }

        private async Task LogObject(Account accountBeforeChanges, Account accountAfterChanges, string action, string userId, string userName )
        {
            try
            {
                // Create a new account log
                DateTimeOffset utcNow = DateTimeOffset.UtcNow;

                AccountLog accountLog = new AccountLog
                {
                    LogId = Guid.NewGuid(),
                    AccountId = accountBeforeChanges.AccountId,
                    Action = action,
                    Date = utcNow,
                    AccountBeforeChanges = accountBeforeChanges,
                    AccountAfterChanges = accountAfterChanges,
                    UserId = userId,
                    UserName = userName
                };

                // Save the account log to the database
                using (var context = _contextFactory.CreateDbContext())
                {
                    context.AccountLogs.Add(accountLog);
                    await context.SaveChangesAsync();
                }

                return;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error logging object. Exception Catched", "AccountsController.cs", "UNKNOWN", "LogObject", ex.Message);
                }

                await _errorReportingService.ReportError("Error logging object. Exception Catched", "AccountsController.cs", identityUser.Id, "LogObject", ex.Message);

                return;
            }
        }


        [HttpPost("create-new-account")]
        [Authorize]
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

                DateTimeOffset utcNow = DateTimeOffset.UtcNow;

                // Create a new account
                var account = new Account
                {
                    AccountName = newAccount.AccountName,
                    Description = newAccount.Description,
                    NormalSide = "Debit", // "Credit" or "Debit"
                    Category = newAccount.Category,
                    Subcategory = newAccount.Subcategory,
                    UserId = user.Id,
                    AccountNumber = newAccount.AccountNumber,
                    ActiveStatus = true,
                    Debit = 0,
                    Credit = 0,
                    Balance = newAccount.InitialBalance,
                    DateAdded = utcNow,
                    Order = "",
                    Statement = "",
                    Comment = ""
                };

                //get the account number
                /*
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
                */

                using (var context = _contextFactory.CreateDbContext())
                {
                    //ensure account numbers arent the same 
                    var accountExists = await context.Accounts.FirstOrDefaultAsync(a => a.AccountNumber == account.AccountNumber);
                    if (accountExists != null)
                    {
                        return BadRequest("Account number already exists");
                    }

                    var nameAlreadyExists = await context.Accounts.FirstOrDefaultAsync(a => a.AccountName == account.AccountName);

                    if (nameAlreadyExists != null)
                    {
                        return BadRequest("Account name already exists");
                    }

                    // Save the account to the database
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
                    Balance = account.Balance,
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
                    await _errorReportingService.ReportError("Error creating new account. Exception Catched", "AccountsController.cs", "UNKNOWN", "CreateNewAccount", ex.Message);
                }

                await _errorReportingService.ReportError("Error creating new account. Exception Catched", "AccountsController.cs", identityUser.Id, "CreateNewAccount", ex.Message);

                return StatusCode(500, "Error creating new account");
            }
        }

        [HttpGet("get-accounts")]
        [Authorize]
        public async Task<IActionResult> GetAccounts([FromQuery] int pageSize, [FromQuery] int pageIndex, [FromQuery] int activeStatus, [FromQuery] string searchString = "")
        {
            try
            {
                // Verify pageSize and pageIndex are positive, else set to default values
                pageSize = pageSize > 0 ? pageSize : 10;
                pageIndex = pageIndex > 0 ? pageIndex : 1;

                using var db = _contextFactory.CreateDbContext();
                IQueryable<Account> accountsQuery = db.Accounts;

                if (!string.IsNullOrWhiteSpace(searchString))
                {
                    // Normalize the searchString to ensure consistent comparison (e.g., trimming and converting to lowercase).
                    var normalizedSearchString = searchString.Trim().ToLower();

                    accountsQuery = accountsQuery.Where(u =>
                        (u.AccountName.ToLower()).Contains(normalizedSearchString));


                }


                // Apply active status filter
                switch (activeStatus)
                {
                    case 0:
                        accountsQuery = accountsQuery.Where(u => !u.ActiveStatus);
                        break;
                    case 1:
                        accountsQuery = accountsQuery.Where(u => u.ActiveStatus);
                        break;
                    default:
                        //if 2 then return all users (do nothing)
                        break;
                }

                var accounts = accountsQuery
                    .Skip((pageIndex - 1) * pageSize)
                    .Take(pageSize);

                var accountsDto = new List<ReturnAccountDTO>();

                foreach (var account in accounts)
                {
                    var accountDto = new ReturnAccountDTO
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
                        Balance = account.Balance,
                        NormalSide = account.NormalSide,
                        Order = account.Order,
                        Statement = account.Statement,
                        Subcategory = account.Subcategory,
                        UserId = account.UserId
                    };

                    accountsDto.Add(accountDto);
                }

                return Ok(accountsDto);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update-account")]
        [Authorize]
        public async Task<IActionResult> UpdateAccount([FromBody] ReturnAccountDTO updateAccount)
        {
            try
            {
                // Validate user
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return Unauthorized();
                }

                // Validate the model
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Get the account
                using (var context = _contextFactory.CreateDbContext())
                {
                    var account = await context.Accounts.FirstOrDefaultAsync(a => a.AccountId == updateAccount.AccountId);

                    var accountBeforeChanges = new Account
                    {
                        AccountId = account.AccountId,
                        AccountName = account.AccountName,
                        Description = account.Description,
                        Category = account.Category,
                        Subcategory = account.Subcategory,
                        ActiveStatus = account.ActiveStatus,
                        Balance = account.Balance,
                        Credit = account.Credit,
                        Debit = account.Debit,
                        DateAdded = account.DateAdded,
                        NormalSide = account.NormalSide,
                        Order = account.Order,
                        Statement = account.Statement,
                        UserId = account.UserId,
                        Comment = account.Comment
                    };

                    if (account == null)
                    {
                        return NotFound("Account not found");
                    }

                    account.AccountName = updateAccount.AccountName;
                    account.Description = updateAccount.Description;
                    account.Category = updateAccount.Category;
                    account.Subcategory = updateAccount.Subcategory;

                    context.Accounts.Update(account);
                    await context.SaveChangesAsync();

                    await LogObject(accountBeforeChanges, account, "Account Information Update", user.Id, user.UserName);
                }

                return Ok("Account updated successfully");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error updating account. Exception Catched", "AccountsController.cs", "UNKNOWN", "UpdateAccount", ex.Message);
                }

                await _errorReportingService.ReportError("Error updating account. Exception Catched", "AccountsController.cs", identityUser.Id, "UpdateAccount", ex.Message);

                return StatusCode(500, "Error updating account");
            }
        }

        [HttpPut("deactivate-accounts")]
        [Authorize]
        public async Task<IActionResult> DeactivateAccount([FromBody] List<string> accountIds)
        {
            try
            {
                // Validate user
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return Unauthorized();
                }

                // Get the account
                using (var context = _contextFactory.CreateDbContext())
                {
                    var accountsBeforeChanges = new List<Account>();
                    var accountsAfterChanges = new List<Account>(); 
                    foreach (var accountId in accountIds)
                    {
                        var account = await context.Accounts.FirstOrDefaultAsync(a => a.AccountId.ToString() == accountId);
                        var accountBeforeChanges = account;
                        accountsBeforeChanges.Add(accountBeforeChanges);

                        if (account == null)
                        {
                            continue;
                        }

                        account.ActiveStatus = false;
                        accountsAfterChanges.Add(account);
                    }

                    await context.SaveChangesAsync();

                    // Log the changes
                    for (int i = 0; i < accountsBeforeChanges.Count; i++)
                    {
                        await LogObject(accountsBeforeChanges[i], accountsAfterChanges[i], "Account Deactivation", user.Id, user.UserName);
                    }
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

        [HttpPut("activate-accounts")]
        [Authorize]
        public async Task<IActionResult> ActivateAccount([FromBody] List<string> accountIds)
        {
            try
            {
                // Validate user
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return Unauthorized();
                }

                // Get the account
                using (var context = _contextFactory.CreateDbContext())
                {
                    var accountsBeforeChanges = new List<Account>();
                    var accountsAfterChanges = new List<Account>();
                    foreach (var accountId in accountIds)
                    {
                        var account = await context.Accounts.FirstOrDefaultAsync(a => a.AccountId.ToString() == accountId);
                        var accountBeforeChanges = account;
                        accountsBeforeChanges.Add(accountBeforeChanges);
                        if (account == null)
                        {
                            continue;
                        }

                        account.ActiveStatus = true;
                        accountsAfterChanges.Add(account);
                    }

                    await context.SaveChangesAsync();

                    // Log the changes
                    for (int i = 0; i < accountsBeforeChanges.Count; i++)
                    {
                        await LogObject(accountsBeforeChanges[i], accountsAfterChanges[i], "Account Activation", user.Id, user.UserName);
                    }
                }

                return Ok("Account activated successfully");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error activating account. Exception Catched", "AccountsController.cs", "UNKNOWN", "ActivateAccount", ex.Message);
                }

                await _errorReportingService.ReportError("Error activating account. Exception Catched", "AccountsController.cs", identityUser.Id, "ActivateAccount", ex.Message);

                return StatusCode(500, "Error activating account");
            }
        }

        [HttpDelete("delete-accounts")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount([FromBody] List<string> accountIds)
        {
            try
            {
                // Validate user
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return Unauthorized();
                }

                // Get the account
                using (var context = _contextFactory.CreateDbContext())
                {
                    var accountsBeforeChanges = new List<Account>();
                    var accountsAfterChanges = new List<Account>();

                    foreach (var accountId in accountIds)
                    {
                        var account = await context.Accounts.FirstOrDefaultAsync(a => a.AccountId.ToString() == accountId);
                        var accountBeforeChanges = account;
                        accountsBeforeChanges.Add(accountBeforeChanges);

                        if (account == null)
                        {
                            continue;
                        }

                        context.Accounts.Remove(account);
                        accountsAfterChanges.Add(account);
                    }

                    await context.SaveChangesAsync();

                    // Log the changes
                    for (int i = 0; i < accountsBeforeChanges.Count; i++)
                    {
                        await LogObject(accountsBeforeChanges[i], accountsAfterChanges[i], "Account Deletion", user.Id, user.UserName);
                    }
                }

                return Ok("Account deleted successfully");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error deleting account. Exception Catched", "AccountsController.cs", "UNKNOWN", "DeleteAccount", ex.Message);
                }

                await _errorReportingService.ReportError("Error deleting account. Exception Catched", "AccountsController.cs", identityUser.Id, "DeleteAccount", ex.Message);

                return StatusCode(500, "Error deleting account");
            }
        }

        [HttpPost("create-new-account-transaction")]
        [Authorize]
        public async Task<IActionResult> NewAccountTransaction([FromBody] AccountTransactionsDTO newTransaction)
        {
            try
            {
                //validate user
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return Unauthorized();
                }

                //if user is manager or admin, then allow the transaction
                bool IsApproved = false;
                if (await _userManager.IsInRoleAsync(user, "Manager") || await _userManager.IsInRoleAsync(user, "Admin"))
                {
                    IsApproved = true;
                }


                var db = _contextFactory.CreateDbContext();

                //Verify if the account exists
                var account = await db.Accounts.FirstOrDefaultAsync(a => a.AccountId == newTransaction.AccountId);

                if (account == null)
                {
                    return NotFound("Account not found");
                }

                var utcNow = DateTimeOffset.UtcNow;

                AccountTransaction accountTransaction = new AccountTransaction
                {
                    TransactionId = Guid.NewGuid(),
                    UserId = user.Id,
                    AccountId = newTransaction.AccountId,
                    BeforeTransactionBalance = newTransaction.BeforeTransactionBalance,
                    AfterTransactionBalance = newTransaction.AfterTransactionBalance,
                    TransactionAmount = newTransaction.TransactionAmount,
                    TransactionDescription = newTransaction.TransactionDescription,
                    TransactionDate = utcNow,
                    IsApproved = false,
                    Rejected = false
                };

                //To manage concurrency, check if the before transaction balance is the same as the current balance, if not then return an error message
                if (account.Balance != newTransaction.BeforeTransactionBalance)
                {
                    return BadRequest("The before transaction balance does not match the current balance");
                }

                //Update the account balance
                account.Balance = newTransaction.AfterTransactionBalance;

                await db.AccountTransactions.AddAsync(accountTransaction);

                db.Accounts.Update(account);

                await db.SaveChangesAsync();

                AccountTransactionsDTO returnTransaction = new AccountTransactionsDTO
                {
                    AccountId = accountTransaction.AccountId,
                    TransactionId = accountTransaction.TransactionId,
                    TransactionDate = accountTransaction.TransactionDate,
                    TransactionDescription = accountTransaction.TransactionDescription,
                    TransactionAmount = accountTransaction.TransactionAmount,
                    BeforeTransactionBalance = accountTransaction.BeforeTransactionBalance,
                    AfterTransactionBalance = accountTransaction.AfterTransactionBalance,
                    UserName = user.UserName
                };

                //return the account transaction
                return Ok(returnTransaction);

            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error creating new account transaction. Exception Catched", "AccountsController.cs", "UNKNOWN", "NewAccountTransaction", ex.Message);
                }

                await _errorReportingService.ReportError("Error creating new account transaction. Exception Catched", "AccountsController.cs", identityUser.Id, "NewAccountTransaction", ex.Message);

                return StatusCode(500, "Error creating new account transaction");
            }
        }

        [HttpGet("get-account-transactions")]
        [Authorize]
        public async Task<IActionResult> GetAccounTransactions([FromQuery] string accountId)
        {
            try
            {
                //validate user
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return Unauthorized();
                }

                var db = _contextFactory.CreateDbContext();

                //Verify if the account exists
                var account = await db.Accounts.FirstOrDefaultAsync(a => a.AccountId.ToString() == accountId);

                if (account == null)
                {
                    return NotFound("Account not found");
                }

                //Get the account transactions
                var accountTransactions = await db.AccountTransactions.Where(a => a.AccountId.ToString() == accountId).ToListAsync();

                if (accountTransactions == null || accountTransactions.Count() == 0)
                {
                    return Ok();
                }

                List<AccountTransactionsDTO> accountTransactionsDTO = new List<AccountTransactionsDTO>();

                foreach (var transaction in accountTransactions)
                {
                    AccountTransactionsDTO accountTransaction = new AccountTransactionsDTO
                    {
                        AccountId = transaction.AccountId,
                        TransactionId = transaction.TransactionId,
                        TransactionDate = transaction.TransactionDate,
                        TransactionDescription = transaction.TransactionDescription,
                        TransactionAmount = transaction.TransactionAmount,
                        BeforeTransactionBalance = transaction.BeforeTransactionBalance,
                        AfterTransactionBalance = transaction.AfterTransactionBalance,
                        UserName = user.UserName,
                        IsApproved = transaction.IsApproved,
                        Rejected = transaction.Rejected
                    };

                    if(accountTransaction.Rejected == true)
                    {
                        //Grab rejection object
                        var rejectedTransaction = await db.RejectedAccountTransactions.FirstOrDefaultAsync(a => a.transactionId == transaction.TransactionId);

                        if (rejectedTransaction == null)
                        {
                            break;
                        }

                        accountTransaction.RejectedAccountTransaction = rejectedTransaction;
                    }

                    accountTransactionsDTO.Add(accountTransaction);
                }

                return Ok(accountTransactionsDTO);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error getting account transactions. Exception Catched", "AccountsController.cs", "UNKNOWN", "GetAccounTransactions", ex.Message);
                }

                await _errorReportingService.ReportError("Error getting account transactions. Exception Catched", "AccountsController.cs", identityUser.Id, "GetAccounTransactions", ex.Message);

                return StatusCode(500, "Error getting account transactions");
            }
        }

        [HttpGet("get-account-logs")]
        [Authorize]
        public async Task<IActionResult> GetAccountLogs([FromQuery] string accountId)
        {
            try
            {
                //validate user
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return Unauthorized();
                }

                //Get the account logs
                using (var context = _contextFactory.CreateDbContext())
                {
                    var accountLogs = await context.AccountLogs.Where(a => a.AccountId.ToString() == accountId).ToListAsync();
 
                    return Ok(accountLogs);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error getting account logs. Exception Catched", "AccountsController.cs", "UNKNOWN", "GetAccountLogs", ex.Message);
                }

                await _errorReportingService.ReportError("Error getting account logs. Exception Catched", "AccountsController.cs", identityUser.Id, "GetAccountLogs", ex.Message);

                return StatusCode(500, "Error getting account logs");
            }
        }
    
        [HttpPost("approve-transaction")]
        [Authorize]
        public async Task<IActionResult> ApproveTransaction([FromBody] string transactionId)
        {
            try
            {
               //validate is manager or admin
               var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                     return Unauthorized();
                }

                if (!await _userManager.IsInRoleAsync(user, "Manager") && !await _userManager.IsInRoleAsync(user, "Admin"))
                {
                    return Unauthorized();
                }

                // Get the account
                using (var context = _contextFactory.CreateDbContext())
                {
                    var accountTransaction = await context.AccountTransactions.FirstOrDefaultAsync(a => a.TransactionId.ToString() == transactionId);

                    if (accountTransaction == null)
                    {
                        return NotFound("Transaction not found");
                    }

                    accountTransaction.IsApproved = true;

                    context.AccountTransactions.Update(accountTransaction);
                    await context.SaveChangesAsync();
                }

                return Ok("Transaction approved successfully");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error approving transaction. Exception Catched", "AccountsController.cs", "UNKNOWN", "ApproveTransaction", ex.Message);
                }

                await _errorReportingService.ReportError("Error approving transaction. Exception Catched", "AccountsController.cs", identityUser.Id, "ApproveTransaction", ex.Message);

                return StatusCode(500, "Error approving transaction");
            }

        }


        [HttpPost("reject-transaction")]
        [Authorize]
        public async Task<IActionResult> RejectTransaction([FromQuery] string transactionId, [FromQuery] string rejectionReason)
        {
            try
            {
                //validate is manager or admin
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return Unauthorized();
                }

                if (!await _userManager.IsInRoleAsync(user, "Manager") && !await _userManager.IsInRoleAsync(user, "Admin"))
                {
                    return Unauthorized();
                }

                // Get the account
                using (var context = _contextFactory.CreateDbContext())
                {
                    var accountTransaction = await context.AccountTransactions.FirstOrDefaultAsync(a => a.TransactionId.ToString() == transactionId);

                    if (accountTransaction == null)
                    {
                        return NotFound("Transaction not found");
                    }

                    var dbUser = await context.Users.Where(u => u.id == user.Id).FirstOrDefaultAsync();

                    if (dbUser == null)
                    {
                        return NotFound("User not found");
                    }

                    accountTransaction.Rejected = true;

                    context.AccountTransactions.Update(accountTransaction);

                    DateTimeOffset utcNow = DateTimeOffset.UtcNow;

                    RejectedAccountTransaction rejectedAccountTransaction = new RejectedAccountTransaction
                    {
                        id = Guid.NewGuid(),
                        accountId = accountTransaction.AccountId,
                        transactionId = accountTransaction.TransactionId,
                        rejectionReason = rejectionReason,
                        rejectionDate = utcNow,
                        rejectedByFullName = dbUser.FirstName + " " + dbUser.LastName,
                        rejectedById = user.Id
                    };

                    context.RejectedAccountTransactions.Add(rejectedAccountTransaction);

                    //update account balance
                    var account = await context.Accounts.FirstOrDefaultAsync(a => a.AccountId == accountTransaction.AccountId);

                    if (account == null)
                    {
                        return NotFound("Account not found");
                    }

                    //to update account balance first determine if the transaction is a debit or credit
                    if (accountTransaction.TransactionAmount > 0)
                    {
                        account.Balance -= accountTransaction.TransactionAmount;
                    }
                    else
                    {
                        account.Balance -= accountTransaction.TransactionAmount;
                    }

                    context.Accounts.Update(account);

                    await context.SaveChangesAsync();
                }

                //return the account transaction
                return Ok("Transaction rejected successfully");
            }
            catch(Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error rejecting transaction. Exception Catched", "AccountsController.cs", "UNKNOWN", "RejectTransaction", ex.Message);
                }

                await _errorReportingService.ReportError("Error rejecting transaction. Exception Catched", "AccountsController.cs", identityUser.Id, "RejectTransaction", ex.Message);

                return StatusCode(500, "Error rejecting transaction");
            }
        }
    
        [HttpGet("rejected-transactions")]
        [Authorize]
        public async Task<IActionResult> GetRejectedTransactions([FromBody] List<string> transactionIds)
        {
            try
            {
                //validate user
                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                {
                    return Unauthorized();
                }

                //get all rejected transactions under transactionIds
                using (var context = _contextFactory.CreateDbContext())
                {
                    var rejectedTransactions = await context.RejectedAccountTransactions.Where(a => transactionIds.Contains(a.transactionId.ToString())).ToListAsync();

                    //return the rejected transactions

                    return Ok(rejectedTransactions);
                }
            }
            catch(Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error getting rejected transactions. Exception Catched", "AccountsController.cs", "UNKNOWN", "GetRejectedTransactions", ex.Message);
                }

                await _errorReportingService.ReportError("Error getting rejected transactions. Exception Catched", "AccountsController.cs", identityUser.Id, "GetRejectedTransactions", ex.Message);

                return StatusCode(500, "Error getting rejected transactions");
            }
        }
    }

}
