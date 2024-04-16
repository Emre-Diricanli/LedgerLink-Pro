using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class RejectedJournalEntry
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid TransactionId { get; set; }
    public string UserId { get; set; }
    public Guid AccountId { get; set; }
    public decimal TransactionAmount { get; set; }
    public string TransactionDescription { get; set; }

    public string rejectionReason { get; set; }
    public DateTimeOffset rejectionDate { get; set; }
    public string rejectedByFullName { get; set; }
    public string rejectedById { get; set; }

    public DateTimeOffset TransactionDate { get; set; }

    public List<JournalEntryLineDTO> JournalEntries { get; set; }

    public bool IsAdjustingEntry { get; set; }
}