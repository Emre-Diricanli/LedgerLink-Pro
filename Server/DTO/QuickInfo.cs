using LedgerLinkPro.DTO.Accounts;

namespace LedgerLinkPro.DTO
{
    public class DashboardQuickInfo
    {
        public List<UnapprovedJournalEntryStats> UnapprovedJournalEntries { get; set; }
        public List<ErrorLogStats> ErrorLogs { get; set; }

        public DashboardQuickInfo()
        {
            UnapprovedJournalEntries = new List<UnapprovedJournalEntryStats>();
            ErrorLogs = new List<ErrorLogStats>();
        }
    }

    public class UnapprovedJournalEntryStats
    {
        public int AccountNumber { get; set; }
        public string AccountName { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class ErrorLogStats
    {
        public int ErrorCount { get; set; }
        public string ErrorType { get; set; }
    }

    public class AccountsChartInfo
    {
        public List<AccountJournalEntryDTO> accountJournalEntries { get; set; }

        public AccountsChartInfo()
        {
            accountJournalEntries = new List<AccountJournalEntryDTO>();
        }
    }

    public class DashboardInfoDTO
    {
        public string AccountType { get; set; }
        public int AccountCount { get; set; }
        public List<CreditDebitMonthDTO> CreditDebitMonth { get; set; }

        public DashboardInfoDTO()
        {
            CreditDebitMonth = new List<CreditDebitMonthDTO>();
        }
    }

    public class CreditDebitMonthDTO
    {
        public string Month { get; set; }
        public decimal Credit { get; set; }
        public decimal Debit { get; set; }
    }
}
