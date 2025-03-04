using Microsoft.AspNetCore.Mvc;
using ProjectSm3.Service;
using ProjectSm3.Dto.Request;

namespace ProjectSm3.Controller;

[ApiController]
[Route("api/[controller]")]
public class SeatController(SeatService seatService, ValidationService validationService) : ControllerBase
{
    [HttpPost("/Seat/{type}")]
    public async Task<IActionResult> MethodPost(string type, [FromBody] object? payload)
    {
        IActionResult validationResult;
        switch (type.ToLower())
        {
            case "getseats":
                validationResult = validationService.ValidatePayload<GetSeatsRequest>(payload, out var getSeatsRequest);
                return validationResult ?? Ok(await seatService.GetSeats(getSeatsRequest.RoomId));
            case "blockseat":
                validationResult = validationService.ValidatePayload<BlockSeatRequest>(payload, out var blockSeatRequest);
                return validationResult ?? Ok(await seatService.BlockSeat(blockSeatRequest.SeatIds));

            default:
                return BadRequest(new { Status = 404, Message = $"/{type} không tồn tại !!" });
        }
    }
}