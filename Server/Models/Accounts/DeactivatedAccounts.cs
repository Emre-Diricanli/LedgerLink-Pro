using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLinkPro.Server.Models.Accounts
{
    public class DeactivatedAccounts
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public Guid AccountId { get; set; }
        public string AccountName { get; set; }
        public string AccountNumber { get; set; }
        public DateTime DeactivationDate { get; set; }

    }
}