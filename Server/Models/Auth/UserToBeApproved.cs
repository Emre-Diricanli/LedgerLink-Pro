using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLinkPro.Models.Auth
{
    public class UserToBeApproved
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Email { get; set; }
        public string GeneratedPassword { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DOB { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string ApptNumber { get; set; }
    }
}