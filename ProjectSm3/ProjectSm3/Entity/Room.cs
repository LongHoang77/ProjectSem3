using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectSm3.Entity;

public class Room
{
    [Key]
    public int RoomId { get; set; }

    [Required]
    [StringLength(50)]
    public string RoomName { get; set; }

    [Required]
    public int NumberOfColumns { get; set; } = 15;

    [Required]
    public int NumberOfRows { get; set; } = 10;

    [Required]
    public int Capacity { get => NumberOfColumns * NumberOfRows; }

    public ICollection<Seat> Seats { get; set; }
    public ICollection<Showtime> Showtimes { get; set; }
}