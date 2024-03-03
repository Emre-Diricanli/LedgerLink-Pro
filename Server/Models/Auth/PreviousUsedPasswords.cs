using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLinkPro.Models.Auth
{
    public class PreviousUsedPasswords
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Index { get; set; }
        public string UserId { get; set; }
        public string PasswordHash { get; set; }
    }
}