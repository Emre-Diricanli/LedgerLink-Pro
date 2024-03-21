namespace LedgerLinkPro.DTO.User
{
    public class UserSigninResult
    {
        public bool resultSuccess { get; set; }
        public bool? userNeedsPasswordReset { get; set; }
        public string? token { get; set; }
        public string? id { get; set; }
        public int? code { get; set; }
    }
}
