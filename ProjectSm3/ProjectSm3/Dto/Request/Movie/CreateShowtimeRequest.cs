using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Dto.Request.Showtime;

public class CreateShowtimeRequest
{
    [Required(ErrorMessage = "ID phim là bắt buộc")]
    public int MovieId { get; set; }

    [Required(ErrorMessage = "ID phòng chiếu là bắt buộc")]
    public int RoomId { get; set; }

    [Required(ErrorMessage = "Thời gian bắt đầu là bắt buộc")]
    public DateTime StartTime { get; set; }

    [Required(ErrorMessage = "Định dạng phim là bắt buộc")]
    public string FormatMovie { get; set; }
    
    [Required]
    [StringLength(20)]
    public string Status { get; set; } = "Active";
    
    public bool IsUtc { get; set; } = true;
}