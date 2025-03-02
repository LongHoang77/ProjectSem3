using System;

namespace ProjectSm3.Dto.Response;

public class ShowtimeResponse
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public string MovieTitle { get; set; }
    public int RoomId { get; set; }
    public string RoomName { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string FormatMovie { get; set; }
    public string Status { get; set; }
}