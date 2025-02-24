using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectSm3.Entity;

public class Seat
{
    [Key]
    public int Id { get; set; }

    public int RoomId { get; set; }
    public int RowNumber { get; set; }
    public int ColNumber { get; set; }

    [Required]
    [StringLength(50)]
    public string Status { get; set; }

    [Required]
    [StringLength(50)]
    public string SeatType { get; set; }

    public bool SeatLock { get; set; }
    public DateTime? SeatLockTime { get; set; }

    [ForeignKey("RoomId")]
    public Room Room { get; set; }
}