namespace LedgerLink_Pro_Backend.DTO
{
    public class ReturnUserExpireAccessModel
    {
        public Guid expireId { get; set; }
        public string expireStartDate { get; set; }
        public string expireEndDate { get; set; }
        public string? reason { get; set; }
        public string AssigneeName { get; set; }
    }
}
