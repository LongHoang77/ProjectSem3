using Microsoft.AspNetCore.Mvc;
using ProjectSm3.Service;
using ProjectSm3.Dto.Request;
using ProjectSm3.Dto.Request.Movie;
using ProjectSm3.Dto.Request.Showtime;
using ProjectSm3.Exception;
using ProjectSm3.Repositories.Interface;
using ProjectSm3.VNPayIntegration;
namespace ProjectSm3.Controller;


[Route("api/[controller]")]
[ApiController]
public class PayController : ControllerBase
{
    private readonly VnpayService _vnpayService;
    private readonly IVnPayServiceRepo _vnPayService;
    private readonly IConfiguration _configuration;

    public PayController(VnpayService vnpayService, IVnPayServiceRepo vnPayService, IConfiguration configuration)
    {
        _vnpayService = vnpayService;
        _vnPayService = vnPayService;
        _configuration = configuration;
    }


[HttpPost]
[Route("test")]
public IActionResult TestApi([FromBody] PaymentRequest request) // Lấy dữ liệu từ request body
{
    if (request == null || request.Amount <= 0)
    {
        return BadRequest("Invalid payment information");
    }

    PaymentInformation paymentInformation = new PaymentInformation
    {
        Name = "Vé xem phim",
        OrderDescription = $"Thanh toán vé xem phim - Suất chiếu: {request.Showtime}",
        OrderType = "movie_ticket",
        Amount = request.Amount , // VNPay yêu cầu nhân 100
        ReturnUrl = "http://localhost:5000/api/payment/return"
    };  

    var paymentUrl = _vnPayService.CreatePaymentUrl(paymentInformation, HttpContext);
    Console.WriteLine($"VNPay URL: {paymentUrl}"); // Log URL để debug

    return Ok(new { paymentUrl });
}

    // return Ok(new { Message = "API đang hoạt động!", Timestamp = DateTime.UtcNow });

        
    }
