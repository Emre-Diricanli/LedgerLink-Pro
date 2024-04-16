namespace LedgerLinkPro.DTO.Accounts
{
    public class TrialBalanceDTO
    {
        public List<ReturnAccountDTO> Accounts { get; set; }
        public decimal TotalDebit { get; set; }
        public decimal TotalCredit { get; set; }
    }
}