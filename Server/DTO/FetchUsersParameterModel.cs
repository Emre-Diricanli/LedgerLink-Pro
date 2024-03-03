namespace LedgerLinkPro.DTO
{
    public class FetchUsersParameterModel
    {
        public string? searchString { get; set; }
        public int? pageIndex { get; set; }
        public int? pageSize { get; set; }
        public int userType { get; set; }
        public int activeStatus { get; set; }
    }
}