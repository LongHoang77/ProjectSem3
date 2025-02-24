using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Exception;

public static class DtoValidationHelper
{
    public static Dictionary<string, string> ValidateDto<T>(T dto)
    {
        var validationResults = new List<ValidationResult>();
        var context = new ValidationContext(dto, null, null);
        var isValid = Validator.TryValidateObject(dto, context, validationResults, true);

        var errors = new Dictionary<string, string>();
        if (isValid) return errors;
        foreach (var validationResult in validationResults)
        {
            var memberName = validationResult.MemberNames?.FirstOrDefault() ?? "Unknown";
            errors[memberName] = validationResult.ErrorMessage ?? "Lỗi không xác định.";
        }
        return errors;
    }
}