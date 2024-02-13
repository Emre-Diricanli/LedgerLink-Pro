namespace LedgerLink_Pro_Backend.DTO;

public class UserInfoReturnModel
{
    public string UserId { get; set; }
    public string Username { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Role { get; set; }
    public bool IsActive { get; set; }
    public bool NeedsPasswordReset { get; set; }
    public bool ConfirmedEmail { get; set; }
    public DateTime? LastLogin { get; set; }
    public List<DateTime> Last5Logins { get; set; }
    public DateTime? PasswordExpiration { get; set; }

    public string? StreetAddress { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? PhoneNumber { get; set; }
}