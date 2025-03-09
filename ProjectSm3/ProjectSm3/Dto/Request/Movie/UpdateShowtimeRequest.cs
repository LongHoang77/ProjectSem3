using System;
using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Dto.Request.Movie;

public class UpdateShowtimeRequest
{
    [Required]
    public int Id { get; set; }
    
    [Required]
    public int RoomId { get; set; }
    
    [Required]
    public int MovieId { get; set; }
    
    [Required]
    public DateTime StartTime { get; set; }
    
    [Required]
    public string FormatMovie { get; set; }
    
    [Required]
    [StringLength(20)]
    public string Status { get; set; } = "Active";

    public int MaxTickets { get; set; }
}