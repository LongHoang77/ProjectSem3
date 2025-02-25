using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Dto.Request;

public class BlockSeatRequest
{
    [Required(ErrorMessage = "Danh sách ID ghế không được để trống.")]
    public List<int> SeatIds { get; set; }
}