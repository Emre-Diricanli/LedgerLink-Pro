using LedgerLink_Pro_Backend.Models.Users;

namespace LedgerLink_Pro_Backend.DTO;

public class UserInfoReturnModel
{
    public string userId { get; set; }
    public string username { get; set; }
    public string firstName { get; set; }
    public string lastName { get; set; }
    public string? email { get; set; }
    public string role { get; set; }
    public bool isActive { get; set; }
    public bool needsPasswordReset { get; set; }
    public bool confirmedEmail { get; set; }
    public bool lockedOut { get; set; }
    public int accessFailedCount { get; set; }  
    public DateTime? lockoutEnd { get; set; }
    public DateTime? lastLogin { get; set; }
    public List<DateTime>? last5Logins { get; set; }
    public List<ReturnUserExpireAccessModel>? userExpireAccess { get; set; }
    public DateTime? passwordExpiration { get; set; }
    public string? profilePictureUrl { get; set; }

    public string? streetAddress { get; set; }
    public string? city { get; set; }
    public string? state { get; set; }
    public string? zipCode { get; set; }
    public string? phoneNumber { get; set; }
}