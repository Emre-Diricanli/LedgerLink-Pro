namespace LedgerLinkPro.DTO;

public class PasswordChangeModel
{
    public string token { get; set; }
    public string oldPassword { get; set; }
    public string newpassword { get; set; }
}