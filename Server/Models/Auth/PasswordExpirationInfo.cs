using System.ComponentModel.DataAnnotations;

namespace LedgerLinkPro.Models.Auth
{
    public class PasswordExpirationInfo
    {
        [Key]
        public string UserId { get; set; }
        public DateTime? PasswordExpiration { get; set; }
    }
}