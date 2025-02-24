using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ProjectSm3.Exception;

namespace ProjectSm3.Service;

public class ValidationService
{
    public IActionResult ValidatePayload<T>(object? payload, out T dto) where T : class
    {
        dto = null;

        if (payload is null)
            return new BadRequestObjectResult(new { Status = 400, Message = "Payload không được để trống." });
        try
        {
            dto = JsonConvert.DeserializeObject<T>(payload.ToString());
        }
        catch
        {
            return new BadRequestObjectResult(new { Status = 400, Message = "Payload không đúng định dạng JSON." });
        }

        var errors = DtoValidationHelper.ValidateDto(dto);
        return errors.Any() ? new BadRequestObjectResult(new { Status = 400, Errors = errors }) : null;
    }
}   