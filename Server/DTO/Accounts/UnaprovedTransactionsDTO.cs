namespace LedgerLinkPro.DTO.Accounts
{
    public class UnaprovedTransactionsDTO
    {
        public Guid TransactionId { get; set; }
        public string UserId { get; set; }
        public Guid AccountId { get; set; }
        public decimal TransactionAmount { get; set; }
        public string TransactionDescription { get; set; }

        public DateTimeOffset TransactionDate { get; set; }
    }
}
