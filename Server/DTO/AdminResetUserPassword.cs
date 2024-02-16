namespace LedgerLink_Pro_Backend.DTO
{
    public class AdminResetUserPassword
    {
        public string userId { get; set; }
        public string password { get; set; }
        public bool expirePassword { get; set; }
    }
}
