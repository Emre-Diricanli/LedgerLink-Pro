using System.ComponentModel.DataAnnotations;

namespace LedgerLinkPro.Models.Accounts
{
    public class AccountLog
    {
        [Key]
        public Guid LogId { get; set; }
        public Guid AccountId { get; set; }
        public string Action { get; set; }
        public DateTimeOffset Date { get; set; }
        public Account AccountBeforeChanges { get; set; }
        public Account AccountAfterChanges { get; set; }
        public string? Transaction { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
    }
}
