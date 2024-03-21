namespace LedgerLinkPro.DTO
{
    public class UserRequestAccessModel
    {
        public string email { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public DateTime dob { get; set; }
        public string streetaddress { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string zipcode { get; set; }
        public string apptnumber { get; set; }
    }
}