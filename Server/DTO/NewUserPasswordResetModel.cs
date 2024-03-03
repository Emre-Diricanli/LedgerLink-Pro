namespace LedgerLinkPro.DTO;

public class NewUserResetPasswordModel
{
    public string token { get; set; }
    public string newpassword { get; set; }
    public string userid { get; set; }
}