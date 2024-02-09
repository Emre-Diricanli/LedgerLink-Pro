using System.ComponentModel.DataAnnotations;

namespace LedgerLinkPro.Models.Users
{
    public class User
    {
        [Key]
        public string id { get; set; }
        [Required, MaxLength(20)]
        public string Username { get; set; }
        [Required, MaxLength(25)]
        public string FirstName { get; set; }
        [Required, MaxLength(25)]
        public string LastName { get; set; }
        public string? StreetAddress { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? PhoneNumber { get; set; }
        public int UserRole { get; set; }
        public bool IsActive { get; set; }
    }
}
