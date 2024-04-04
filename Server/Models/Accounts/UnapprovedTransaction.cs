using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLinkPro.Models.Accounts
{
    public class UnapprovedTransaction
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid TransactionId { get; set; }
        public string UserId { get; set; }
        public Guid AccountId { get; set; }
        public decimal TransactionAmount { get; set; }
        public string TransactionDescription { get; set; }
        public DateTimeOffset TransactionDate { get; set; }
    }
}
