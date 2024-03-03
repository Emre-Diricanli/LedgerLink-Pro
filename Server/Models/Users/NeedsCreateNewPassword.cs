using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLinkPro.Models.Users
{
    public class NeedsCreateNewPassword
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int index { get; set; }
        public string Email { get; set; }
        public bool InitialPassword { get; set; }
    }
}
