using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLink_Pro_Backend.Models.Users
{
    public class UserProfilePictureLocations
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string UserId { get; set; }
        public string ProfilePictureLocation { get; set; }
    }
}
