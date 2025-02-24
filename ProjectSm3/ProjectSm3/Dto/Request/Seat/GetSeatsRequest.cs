using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Dto.Request;

public class GetSeatsRequest
{
    [Required(ErrorMessage = "RoomId không được để trống.")]
    public int RoomId { get; set; }
}