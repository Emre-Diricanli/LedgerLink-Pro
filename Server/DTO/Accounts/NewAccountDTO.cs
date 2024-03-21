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
