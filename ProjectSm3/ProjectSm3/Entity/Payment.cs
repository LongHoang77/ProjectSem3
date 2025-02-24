using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectSm3.Entity;

public class Payment
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string UserEmail { get; set; }

    public float Amount { get; set; }

    [Required]
    [StringLength(50)]
    public string PaymentMethod { get; set; }

    [Required]
    [StringLength(50)]
    public string PaymentStatus { get; set; }

    public long TransactionId { get; set; }
    public TimeSpan PaymentTime { get; set; }

    public int TicketId { get; set; }

    [ForeignKey("TicketId")]
    public Ticket Ticket { get; set; }
}