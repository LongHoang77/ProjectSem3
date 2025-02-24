using Microsoft.AspNetCore.Mvc;
using ProjectSm3.Service;
using ProjectSm3.Dto.Request;

namespace ProjectSm3.Controller;

[ApiController]
[Route("api/[controller]")]
public class MovieController(MovieService movieService, ValidationService validationService) : ControllerBase
{
    [HttpPost("/Movie/{type}")]
    public async Task<IActionResult> MethodPost(string type, [FromBody] object? payload)
    {
        IActionResult validationResult;
        switch (type.ToLower())
        {
            default:
                return BadRequest(new { Status = 404, Message = $"/{type} không tồn tại !!" });
        }
    }
}