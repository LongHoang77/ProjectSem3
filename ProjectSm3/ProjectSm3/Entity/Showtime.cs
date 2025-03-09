using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectSm3.Entity;

public class Showtime
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int MovieId { get; set; }

    [Required]
    public int RoomId { get; set; }

    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }

    [Required]
    [StringLength(50)]
    public string FormatMovie { get; set; }
    
    [Required]
    [StringLength(20)]
    public string Status { get; set; } = "Active";

    [ForeignKey("MovieId")]
    public Movie Movie { get; set; }

    [ForeignKey("RoomId")]
    public Room Room { get; set; }

    public ICollection<Ticket> Tickets { get; set; }
    public int MaxTickets { get; set; }
}