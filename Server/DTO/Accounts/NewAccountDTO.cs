using System.ComponentModel.DataAnnotations;

public class NewAccountDTO
{
    public string AccountName { get; set; }
    public int AccountNumber { get; set; }
    public string Description { get; set; }
    public decimal InitialBalance { get; set; }
    public string Category { get; set; }
    public string Subcategory { get; set; }
}

public class NewJournalEntryDTO
{
    public string AccountId { get; set; }
    public string EntryName { get; set; }
    public List<JournalEntryLineDTO> JournalEntryLines { get; set; }
    public bool IsAdjustingEntry { get; set; }
}

public class JournalEntryLineDTO
{
    public int index { get; set; }
    public decimal debit { get; set; }
    public decimal credit { get; set; }
    public string description { get; set; }
}