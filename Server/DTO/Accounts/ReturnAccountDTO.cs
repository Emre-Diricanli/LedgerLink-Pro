using System.ComponentModel.DataAnnotations;

public class ReturnAccountDTO
{
    public Guid AccountId { get; set; }
    public bool ActiveStatus { get; set; }
    public string AccountName { get; set; }
    public int AccountNumber { get; set; }
    public string Description { get; set; }
    public string NormalSide { get; set; }
    public string Category { get; set; }
    public string Subcategory { get; set; }
    public decimal InitialBalance { get; set; }
    public decimal Debit { get; set; }
    public decimal Credit { get; set; }
    public decimal Balance { get; set; }
    public DateTimeOffset DateAdded { get; set; }
    public string UserId { get; set; }
    public string Order { get; set; }
    public string Statement { get; set; }
    public string Comment { get; set; }
}
