using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLinkPro.Models.Accounts
{
    public class AccountEvents
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string EventId { get; set; }
        public string UserId { get; set; }
        public string AccountId { get; set; }
        public string Action { get; set; } // Create, Update, Delete

        [Column(TypeName = "jsonb")]
        public string BeforeImage { get; set; }

        [Column(TypeName = "jsonb")]
        public string AfterImage { get; set; }
        public DateTimeOffset EventDate { get; set; }
    }
}
