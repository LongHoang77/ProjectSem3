using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Dto.Request;

public class BlockSeatRequest
{
    [Required(ErrorMessage = "SeatId không được để trống.")]
    public int SeatId { get; set; }

    public List<int>? AdditionalSeatIds { get; set; }
}