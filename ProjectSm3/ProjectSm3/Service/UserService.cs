using Microsoft.EntityFrameworkCore;
using ProjectSm3.Data;
using ProjectSm3.Dto.Request;
using ProjectSm3.Dto.Response;
using ProjectSm3.Entity;
using ProjectSm3.Exception;

namespace ProjectSm3.Service;


public class UserService(ApplicationDbContext context, JwtTokenService jwtTokenService)
{
    public async Task<string> Register(RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.ConfirmPassword))
            throw new CustomException("Mật khẩu không được để trống.");

        if (request.Password != request.ConfirmPassword)
            throw new CustomException("Mật khẩu không khớp.");

        if (await CheckIfUserExists(request.Username, request.Email))
            throw new CustomException("Tên người dùng hoặc Email đã tồn tại.", 404);

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            CreateDate = DateTime.Now,
            Password = HashPassword(request.Password)
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();
        return "Đăng ký thành công.";
    }

    public async Task<LoginResponse> Login(LoginRequest request)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u =>
                u.Username == request.UsernameOrEmail ||
                u.Email == request.UsernameOrEmail);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
        {
            throw new CustomException("Tên đăng nhập, email hoặc mật khẩu không đúng.", 401);
        }
        
        return new LoginResponse
        {
            UserId = user.Id,
            Email = user.Email,
            Username = user.Username,
            Token = jwtTokenService.GenerateToken(user.Username, user.Email)
        };
    }

    public async Task<int> GetUserCount()
    {
        return await context.Users.CountAsync();
    }

    private async Task<bool> CheckIfUserExists(string username, string email) =>
        await context.Users.AnyAsync(u => u.Username == username || u.Email == email);

    private string HashPassword(string password) => BCrypt.Net.BCrypt.HashPassword(password);
}