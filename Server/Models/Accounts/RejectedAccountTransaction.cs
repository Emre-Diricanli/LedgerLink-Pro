public class RejectedAccountTransaction
{
    public Guid id { get; set; }
    public Guid accountId { get; set; }
    public Guid transactionId { get; set; }
    public string rejectionReason { get; set; }
    public DateTimeOffset rejectionDate { get; set;  }
    public string rejectedByFullName { get; set; }
    public string rejectedById { get; set; }
}