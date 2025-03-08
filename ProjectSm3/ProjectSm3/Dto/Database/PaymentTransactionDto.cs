using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectSm3.Dto.Database;

public class PaymentTransactionDto
{
    [Key] // 👈 Đánh dấu trường Id là khóa chính
    public Guid Id { get; set; } = Guid.NewGuid();
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }
    public string TransactionId { get; set; }
    public string OrderDescription { get; set; }
    public string PaymentStatus { get; set; }
    public string PaymentMethod { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}