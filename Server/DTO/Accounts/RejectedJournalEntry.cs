namespace LedgerLinkPro.DTO.Accounts
{
    public class RejectedJournalEntryDTO
    {
        public Guid TransactionId { get; set; }
        public string UserId { get; set; }
        public Guid AccountId { get; set; }
        public decimal TransactionAmount { get; set; }
        public string TransactionDescription { get; set; }
        public string rejectionReason { get; set; }
        public DateTimeOffset rejectionDate { get; set; }
        public string rejectedByFullName { get; set; }
        public string rejectedById { get; set; }


        public DateTimeOffset TransactionDate { get; set; }
        
        public bool IsAdjustingEntry { get; set; }
    }

    public class UnapprovedJournalEntryDTO
    {
        public Guid TransactionId { get; set; }
        public string UserId { get; set; }
        public Guid AccountId { get; set; }
        public decimal TotalAmount { get; set; }
        public string TransactionDescription { get; set; }
        public List<JournalEntryLineDTO> JournalEntryLines { get; set; }

        public DateTimeOffset TransactionDate { get; set; }

        public bool IsAdjustingEntry { get; set; }
    }
}
