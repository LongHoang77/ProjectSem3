using Microsoft.AspNetCore.Mvc;
using ProjectSm3.Dto.Request;
using ProjectSm3.Service;

namespace ProjectSm3.Controller;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ValidationService _validationService;

    public UserController(UserService userService, ValidationService validationService)
    {
        _userService = userService;
        _validationService = validationService;
    }

    [HttpPost("/Admin/{type}")]
    public async Task<IActionResult> MethodPost(string type, [FromBody] object? payload)
    {
        IActionResult validationResult;
        switch (type.ToLower())
        {
            case "register":
                validationResult = _validationService.ValidatePayload<RegisterRequest>(payload, out var registerRequest);
                return validationResult ?? Ok(await _userService.Register(registerRequest));

            case "login":
                validationResult = _validationService.ValidatePayload<LoginRequest>(payload, out var loginRequest);
                return validationResult ?? Ok(await _userService.Login(loginRequest));

            default:
                return BadRequest(new { Status = 404, Message = $"/{type} không tồn tại !!" });
        }
    }

    [HttpGet("/Admin/count")]
    public async Task<IActionResult> GetUserCount()
    {
        try
        {
            int count = await _userService.GetUserCount();
            return Ok(new { count });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi khi lấy số lượng người dùng", error = ex.Message });
        }
    }
}