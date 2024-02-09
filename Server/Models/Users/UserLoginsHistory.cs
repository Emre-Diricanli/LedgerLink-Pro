using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLinkPro.Models.Users
{
    public class UserLoginHistory
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int index { get; set; }
        public string userId { get; set; }
        public DateTime loginTime { get; set; }
    }
}