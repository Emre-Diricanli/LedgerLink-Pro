using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLinkPro.Models.Accounts
{
    public class AccountTransaction
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid TransactionId { get; set; }
        public string UserId { get; set; }
        public Guid AccountId { get; set; }
        public decimal BeforeTransactionBalance { get; set; }
        public decimal AfterTransactionBalance { get; set; }
        public decimal TransactionAmount { get; set; }
        public string TransactionDescription { get; set; }
     
        public DateTimeOffset TransactionDate { get; set; }
    }
}
