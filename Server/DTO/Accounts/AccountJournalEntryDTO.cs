namespace LedgerLinkPro.DTO.Accounts
{
    public class AccountJournalEntryDTO
    {
        public Guid AccountId { get; set; }
        public Guid? TransactionId { get; set; }
        public DateTimeOffset TransactionDate { get; set; }
        public string? TransactionDescription { get; set; }
        public decimal TransactionAmount { get; set; }
        public decimal BeforeTransactionBalance { get; set; }
        public decimal AfterTransactionBalance { get; set; }
        public string? User { get; set; }
        public List<JournalEntryLineDTO> JournalEntries { get; set; }

    }
}
