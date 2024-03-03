namespace LedgerLink_Pro_Backend.DTO
{
    public class NewUserAccessExpirationModel
    {
        public string userId { get; set; }
        public string expireStartDate { get; set; }
        public string expireEndDate { get; set; }
        public string reason { get; set; }
    }
}
