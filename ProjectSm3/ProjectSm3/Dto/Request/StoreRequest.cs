using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Dto.Request;

public class StoreRequest
{
    [Required(ErrorMessage = "Tên cửa hàng không được để trống.")]
    public string StoreName { get; set; }
    
    [Required(ErrorMessage = "Địa chỉ cửa hàng không được để trống.")]
    [StringLength(2, MinimumLength = 2, ErrorMessage = "Địa chỉ cửa hàng phải có đúng 2 ký tự.")]
    [RegularExpression(@"^[ABC][1-9]$", ErrorMessage = "Địa chỉ cửa hàng phải bắt đầu bằng A, B hoặc C và theo sau là một số từ 1 đến 3.")]
    [ValidateStoreAddress]
    public string Address { get; set; }
}

public class ValidateStoreAddressAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value is not string address)
            return new ValidationResult("Địa chỉ cửa hàng không hợp lệ.");

        if (address.Length != 2)
            return new ValidationResult("Địa chỉ cửa hàng phải có đúng 2 ký tự.");

        var firstChar = char.ToUpper(address[0]);
        if (firstChar != 'A' && firstChar != 'B' && firstChar != 'C')
            return new ValidationResult("Ký tự đầu tiên của địa chỉ cửa hàng phải là A, B hoặc C.");

        if (!char.IsDigit(address[1]) || address[1] == '0')
            return new ValidationResult("Ký tự thứ hai của địa chỉ cửa hàng phải là số từ 1 đến 3.");

        if (!char.IsLower(address[0])) return ValidationResult.Success;
        address = address.ToUpper();
        validationContext.ObjectType.GetProperty(validationContext.MemberName).SetValue(validationContext.ObjectInstance, address);

        return ValidationResult.Success;
    }
} 