using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Dto.Request;


public class RegisterRequest 
{
    [Required(ErrorMessage = "Email không được để trống.")]
    [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Tên người dùng không được để trống.")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Tên người dùng phải từ 3 đến 50 ký tự.")]
    public string Username { get; set; }

    [Required(ErrorMessage = "Mật khẩu không được để trống.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
    [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "Mật khẩu chỉ được chứa chữ và số.")]
    public string Password { get; set; }

    [Required(ErrorMessage = "Xác nhận mật khẩu không được để trống.")]
    [Compare("Password", ErrorMessage = "Mật khẩu và xác nhận mật khẩu không khớp.")]
    public string ConfirmPassword { get; set; }
}