using LedgerLinkPro.Services;
using LedgerLinkPro.Database;
using LedgerLinkPro.Models.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using LedgerLinkPro.DTO.Accounts;
using Newtonsoft.Json;

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

        //for new transactions
        private async Task LogObjectWithTransaction(string accountId, string action, string userId, string userName, string transaction)
        {
            try
            {
                // Create a new account log
                DateTimeOffset utcNow = DateTimeOffset.UtcNow;

                AccountLog accountLog = new AccountLog
                {
                    LogId = Guid.NewGuid(),
                    AccountId = new Guid(accountId),
                    Action = action,
                    Date = utcNow,
                    UserId = userId,
                    UserName = userName,
                    Transaction = transaction
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
                    Balance = 50000,
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
                        NormalSide = account.NormalSide,
                        Order = account.Order,
                        Statement = account.Statement,
                        Subcategory = account.Subcategory,
                        UserId = account.UserId
                    };

                    //find all transactions and add up the balance via transactionAmount
                    var transactions = await db.AccountTransactions.Where(a => a.AccountId == account.AccountId).ToListAsync();

                    decimal balance = 0;

                    foreach (var transaction in transactions)
                    {
                        foreach (var line in transaction.JournalEntries)
                        {
                            balance += line.Amount;
                        }   
                    }

                    accountDto.Balance = balance;

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

        [HttpGet("get-account-transactions/approved")]
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
                var accountTransactions = await db.AccountTransactions.Where(a => a.AccountId.ToString() == accountId).OrderBy(t => t.TransactionDate).ToListAsync();

                if (accountTransactions == null || accountTransactions.Count() == 0)
                {
                    return Ok();
                }

                List<AccountJournalEntryDTO> accountTransactionsDTO = new List<AccountJournalEntryDTO>();

                decimal currentBalance = 0;

                foreach (var transaction in accountTransactions)
                {

                    // Calculate balances before and after the transaction
                    decimal beforeTransactionBalance = currentBalance;
                    

                    //for after transaction balance, add up all journal entry lines
                    decimal afterTransactionBalance = 0;

                    foreach (var line in transaction.JournalEntries)
                    {
                        afterTransactionBalance += line.Amount;
                    }

                    AccountJournalEntryDTO accountTransaction = new AccountJournalEntryDTO
                    {
                        AccountId = transaction.AccountId,
                        TransactionId = transaction.TransactionId,
                        TransactionDate = transaction.TransactionDate,
                        TransactionDescription = transaction.TransactionDescription,
                        BeforeTransactionBalance = beforeTransactionBalance,
                        AfterTransactionBalance = afterTransactionBalance,
                        TransactionAmount = afterTransactionBalance - beforeTransactionBalance,
                        JournalEntries = transaction.JournalEntries,
                        User = "UKNOWN6969"
                    };


                    var creator = await db.Users.FirstOrDefaultAsync(u => u.id == transaction.UserId);

                    if (creator != null)
                    {
                        accountTransaction.User = creator.FirstName + " " + creator.LastName;
                    }
                    else
                    {
                        accountTransaction.User = "Unknown";
                    }

                    // Update the current balance for the next iteration
                    currentBalance = afterTransactionBalance;

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

        [HttpGet("get-account-transactions/unapproved")]
        [Authorize]
        public async Task<IActionResult> GetUnapprovedAccountTransactions([FromQuery] string accountId)
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
                var accountTransactions = await db.UnapprovedJournalEntries.Where(a => a.AccountId.ToString() == accountId).ToListAsync();

                if (accountTransactions == null || accountTransactions.Count() == 0)
                {
                    return Ok();
                }

                List<UnapprovedJournalEntryDTO> unaprovedAccountTransactionsDTO = new List<UnapprovedJournalEntryDTO>();

                foreach (var transaction in accountTransactions)
                {
                    UnapprovedJournalEntryDTO accountTransaction = new UnapprovedJournalEntryDTO
                    {
                        AccountId = transaction.AccountId,
                        TransactionId = transaction.TransactionId,
                        TransactionDate = transaction.TransactionDate,
                        JournalEntryLines = transaction.JournalEntryLines,
                        TransactionDescription = transaction.TransactionDescription,
                        TotalAmount = 0
                    };

                    foreach (var line in transaction.JournalEntryLines)
                    {
                        accountTransaction.TotalAmount += line.Amount;
                    }

                    unaprovedAccountTransactionsDTO.Add(accountTransaction);
                }

                return Ok(unaprovedAccountTransactionsDTO);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error getting unapproved account transactions. Exception Catched", "AccountsController.cs", "UNKNOWN", "GetUnapprovedAccountTransactions", ex.Message);
                }

                await _errorReportingService.ReportError("Error getting unapproved account transactions. Exception Catched", "AccountsController.cs", identityUser.Id, "GetUnapprovedAccountTransactions", ex.Message);

                return StatusCode(500, "Error getting unapproved account transactions");
            }
        }

        [HttpPost("create-new-unapproved-journal-entry")]
        [Authorize]
        public async Task<IActionResult> CreateNewUnapprovedAccountransaction([FromBody] NewJournalEntryDTO newJournalEntry)
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
                var account = await db.Accounts.FirstOrDefaultAsync(a => a.AccountId.ToString() == newJournalEntry.AccountId);

                if (account == null)
                {
                    return NotFound("Account not found");
                }

                var utcNow = DateTimeOffset.UtcNow;

                UnapprovedJournalEntry unapprovedJournalEntry = new UnapprovedJournalEntry
                {
                    TransactionId = Guid.NewGuid(),
                    UserId = user.Id,
                    AccountId = account.AccountId,
                    TransactionDate = utcNow,
                    JournalEntryLines = newJournalEntry.JournalEntryLines,
                    TransactionDescription = newJournalEntry.EntryName
                };

                await db.UnapprovedJournalEntries.AddAsync(unapprovedJournalEntry);

                await db.SaveChangesAsync();

                UnapprovedJournalEntryDTO returnJournalEntry = new UnapprovedJournalEntryDTO
                {
                    AccountId = unapprovedJournalEntry.AccountId,
                    TransactionId = unapprovedJournalEntry.TransactionId,
                    TransactionDate = unapprovedJournalEntry.TransactionDate,
                    JournalEntryLines = unapprovedJournalEntry.JournalEntryLines,
                };

                returnJournalEntry.TotalAmount = 0;

                foreach (var line in unapprovedJournalEntry.JournalEntryLines)
                {
                    returnJournalEntry.TotalAmount += line.Amount;
                }

                //return the account transaction
                return Ok(returnJournalEntry);

            }
            catch (Exception ex)
            {
                //report error
                Debug.WriteLine(ex.Message);
                var identityUser = await _userManager.GetUserAsync(User);

                // Null handling
                if (identityUser == null)
                {
                    await _errorReportingService.ReportError("Error creating new unapproved account transaction. Exception Catched", "AccountsController.cs", "UNKNOWN", "CreateNewUnapprovedAccountransaction", ex.Message);

                    return StatusCode(500, "Error creating new unapproved account transaction");
                }

                await _errorReportingService.ReportError("Error creating new unapproved account transaction. Exception Catched", "AccountsController.cs", identityUser.Id, "CreateNewUnapprovedAccountransaction", ex.Message);

                return StatusCode(500, "Error creating new unapproved account transaction");
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
        public async Task<IActionResult> ApproveTransaction([FromQuery] string transactionId)
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
                    var accountTransaction = await context.UnapprovedJournalEntries.FirstOrDefaultAsync(a => a.TransactionId.ToString() == transactionId);

                    if (accountTransaction == null)
                    {
                        return NotFound("Transaction not found");
                    }

                    var approvedtransaction = new AccountJournalEntry
                    {
                        TransactionId = accountTransaction.TransactionId,
                        UserId = accountTransaction.UserId,
                        AccountId = accountTransaction.AccountId,
                        TransactionDescription = accountTransaction.TransactionDescription,
                        TransactionDate = accountTransaction.TransactionDate,
                        JournalEntries = accountTransaction.JournalEntryLines
                    };

                    context.AccountTransactions.Add(approvedtransaction);

                    await context.SaveChangesAsync();

                    //if successful, remove the unapproved transaction
                    context.UnapprovedJournalEntries.Remove(accountTransaction);

                    //convert the transaction object to a JSON string
                    string transactionJson = JsonConvert.SerializeObject(accountTransaction);

                    // Use the transactionJson as needed
                    await LogObjectWithTransaction(accountTransaction.AccountId.ToString(), "Journal Entry Approved", user.Id, user.UserName, transactionJson);

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
                    var accountTransaction = await context.UnapprovedJournalEntries.FirstOrDefaultAsync(a => a.TransactionId.ToString() == transactionId);

                    if (accountTransaction == null)
                    {
                        return NotFound("Transaction not found");
                    }

                    var dbUser = await context.Users.Where(u => u.id == user.Id).FirstOrDefaultAsync();

                    if (dbUser == null)
                    {
                        return NotFound("User not found");
                    }

                    DateTimeOffset utcNow = DateTimeOffset.UtcNow;

                    RejectedJournalEntry rejectedAccountTransaction = new RejectedJournalEntry
                    {
                        TransactionId = Guid.NewGuid(),
                        AccountId = accountTransaction.AccountId,
                        rejectionReason = rejectionReason,
                        rejectionDate = utcNow,
                        rejectedByFullName = dbUser.FirstName + " " + dbUser.LastName,
                        rejectedById = user.Id,
                        TransactionDescription = accountTransaction.TransactionDescription,
                        TransactionDate = accountTransaction.TransactionDate,
                        UserId = accountTransaction.UserId,
                        JournalEntries = accountTransaction.JournalEntryLines
                    };

                    context.RejectedAccountTransactions.Add(rejectedAccountTransaction);

                    //if successful, remove the unapproved transaction
                    context.UnapprovedJournalEntries.Remove(accountTransaction);

                    //convert the rejection reason object to a JSON string
                    string transactionJson = JsonConvert.SerializeObject(accountTransaction);

                    // Use the transactionJson as needed
                    await LogObjectWithTransaction(accountTransaction.AccountId.ToString(), "Journal Entry Rejected", user.Id, user.UserName, transactionJson);

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
        public async Task<IActionResult> GetRejectedTransactions([FromQuery] string accountId)
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
                    var rejectedJournalEntries = await context.RejectedAccountTransactions.Where(a => a.AccountId.ToString() == accountId).ToListAsync();

                    //return the rejected transactions
                    List<RejectedJournalEntryDTO> rejectedJournalEntriesDTO = new List<RejectedJournalEntryDTO>();

                    foreach (var transaction in rejectedJournalEntries)
                    {
                        RejectedJournalEntryDTO rejectedJournalEntry = new RejectedJournalEntryDTO
                        {
                            TransactionId = transaction.TransactionId,
                            UserId = transaction.UserId,
                            AccountId = transaction.AccountId,
                            TransactionAmount = transaction.TransactionAmount,
                            TransactionDescription = transaction.TransactionDescription,
                            TransactionDate = transaction.TransactionDate,
                            rejectionReason = transaction.rejectionReason,
                            rejectionDate = transaction.rejectionDate,
                            rejectedByFullName = transaction.rejectedByFullName,
                            rejectedById = transaction.rejectedById
                        };

                        rejectedJournalEntriesDTO.Add(rejectedJournalEntry);
                    }

                    


                    return Ok(rejectedJournalEntriesDTO);
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
