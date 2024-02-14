using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLink_Pro_Backend.Models.Users
{
    public class UserExpireAccess
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int index { get; set; }
        public string userId { get; set; }
        public DateTimeOffset expireStartDate { get; set; }
        public DateTimeOffset expireEndDate { get; set; }
        public string reason { get; set; }  
        public string assignedByUserId { get; set; }
    }
}
