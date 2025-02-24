using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectSm3.Entity;

public class Ticket
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ShowtimeId { get; set; }

    [Required]
    public int SeatId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int TicketType { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Required]
    [StringLength(50)]
    public string PaymentStatus { get; set; }

    [ForeignKey("ShowtimeId")]
    public Showtime Showtime { get; set; }

    [ForeignKey("SeatId")]
    public Seat Seat { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }

    public Payment Payment { get; set; }
}