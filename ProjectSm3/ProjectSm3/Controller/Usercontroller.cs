using Microsoft.AspNetCore.Mvc;
using ProjectSm3.Dto.Request;
using ProjectSm3.Service;

namespace ProjectSm3.Controller;


[ApiController]
[Route("api/[controller]")]
public class UserController(UserService userService, ValidationService validationService) : ControllerBase
{
    [HttpPost("/Admin/{type}")]
    public async Task<IActionResult> MethodPost(string type, [FromBody] object? payload)
    {
        IActionResult validationResult;
        switch (type.ToLower())
        {
            case "register":
                validationResult = validationService.ValidatePayload<RegisterRequest>(payload, out var registerRequest);
                return validationResult ?? Ok(await userService.Register(registerRequest));

            case "login":
                validationResult = validationService.ValidatePayload<LoginRequest>(payload, out var loginRequest);
                return validationResult ?? Ok(await userService.Login(loginRequest));

            default:
                return BadRequest(new { Status = 404, Message = $"/{type} không tồn tại !!" });
        }
    }
}