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
}
