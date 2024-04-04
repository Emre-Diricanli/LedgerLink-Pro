namespace LedgerLinkPro.DTO.Accounts
{
    public class AccountTransactionsDTO
    {
        public Guid AccountId { get; set; }
        public Guid? TransactionId { get; set; }
        public DateTimeOffset TransactionDate { get; set; }
        public string? TransactionDescription { get; set; }
        public decimal TransactionAmount { get; set; }
        public decimal BeforeTransactionBalance { get; set; }
        public decimal AfterTransactionBalance { get; set; }

    }
}
