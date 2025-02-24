using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Dto.Request;

public class LoginRequest
{
    [Required(ErrorMessage = "Tên đăng nhập hoặc email không được để trống.")]
    public string UsernameOrEmail { get; set; }

    [Required(ErrorMessage = "Mật khẩu không được để trống.")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
    public string Password { get; set; }
}