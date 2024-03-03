

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LedgerLinkProBackend.Models.Util
{
    public class ReportedErrors
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string ErrorMessage { get; set; }
        public string UserId { get; set; }
        public string FilePath { get; set; }
        public string MethodName { get; set; }
        public string OtherDetails { get; set; }
        public DateTimeOffset DateReported { get; set; }

    }
}
