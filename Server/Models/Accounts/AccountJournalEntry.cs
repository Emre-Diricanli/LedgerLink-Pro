using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLinkPro.Models.Accounts
{
    public class AccountJournalEntry
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid TransactionId { get; set; }
        public string UserId { get; set; }
        public Guid AccountId { get; set; }
        public string TransactionDescription { get; set; }
        public List<JournalEntryLineDTO> JournalEntries { get; set; }
        public DateTimeOffset TransactionDate { get; set; }
    }
}
