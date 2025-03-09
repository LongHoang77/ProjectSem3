using Microsoft.AspNetCore.Mvc;
using ProjectSm3.Service;
using ProjectSm3.Dto.Request;
using ProjectSm3.Dto.Database;
using ProjectSm3.Dto.Request.Showtime;
using ProjectSm3.Exception;
using ProjectSm3.Repositories.Interface;
using ProjectSm3.VNPayIntegration;
using ProjectSm3.Repositories;
using System.Text.Json;

namespace ProjectSm3.Controller;


[Route("api/[controller]")]
[ApiController]
public class PayController : ControllerBase
{
    private readonly VnpayService _vnpayService;
    private readonly IVnPayServiceRepo _vnPayService;
    private readonly IConfiguration _configuration;
    private readonly IPaymentRepository _paymentRepo;

    public PayController(VnpayService vnpayService, IVnPayServiceRepo vnPayService,IPaymentRepository paymentRepo, IConfiguration configuration)
    {
        _vnpayService = vnpayService;
        _vnPayService = vnPayService;
        _configuration = configuration;
        _paymentRepo = paymentRepo;
    }


[HttpPost]
[Route("pay")]
public IActionResult TestApi([FromBody] PaymentRequest request) // Lấy dữ liệu từ request body
{
    if (request == null || request.Amount <= 0)
    {
        return BadRequest("Invalid payment information");
    }

    PaymentInformation paymentInformation = new PaymentInformation
    {
        Name = "Vé xem phim ",
        OrderDescription = $"Thanh toán vé xem phim:{request.movieTitle} - Suất chiếu: {request.Showtime}",
        OrderType = "movie_ticket",
        Amount = request.Amount , 
        ReturnUrl = "http://localhost:5000/api/pay/payment-result",  
        RedirectUrl = "http://localhost:80/FE_user/thanks_2.html",  
    };  

    var paymentUrl = _vnPayService.CreatePaymentUrl(paymentInformation, HttpContext);
    Console.WriteLine($"VNPay URL: {paymentUrl}"); // Log URL để debug

    return Ok(new { paymentUrl });
}

    // return Ok(new { Message = "API đang hoạt động!", Timestamp = DateTime.UtcNow });

        [HttpGet]
        [Route("payment-result")]
        public async Task<IActionResult> PaymentResultAsync()
        {
            var vnpayData = HttpContext.Request.Query;
            PaymentResponse paymentResponse = _vnPayService.PaymentExecute(vnpayData);
            decimal adjustedAmount = paymentResponse.Amount / 100m;
            bool isPaymentSuccessful = paymentResponse.Success && 
                               vnpayData["vnp_ResponseCode"] == "00" && 
                               vnpayData["vnp_TransactionStatus"] == "00";


            var transaction = new PaymentTransactionDto
            {
                Amount = adjustedAmount,
                // Amount = paymentResponse.Amount,
                TransactionId = paymentResponse.TransactionId,
                OrderDescription = paymentResponse.OrderDescription,
                PaymentStatus = isPaymentSuccessful ? "Success" : "Failed",
                PaymentMethod = "VNPay"
            };
            Console.WriteLine($"Transaction Data: {JsonSerializer.Serialize(transaction)}");

    try
    {
        await _paymentRepo.SaveTransactionAsync(transaction);
        Console.WriteLine($"Transaction saved successfully: {transaction.TransactionId}");
        
    }
    catch (System.Exception ex)
    {
        Console.WriteLine($"Error saving transaction: {ex.Message}");
        Console.WriteLine($"StackTrace: {ex.StackTrace}");
        // Có thể xem xét việc trả về lỗi cho client ở đây
    }
        string redirectUrl = _configuration["Payment:RedirectUrl"] ?? "http://localhost:3001/FE_user/thanks_2.html";
        redirectUrl += $"?vnp_ResponseCode={vnpayData["vnp_ResponseCode"]}&vnp_TransactionStatus={vnpayData["vnp_TransactionStatus"]}";
        redirectUrl += $"&vnp_Amount={paymentResponse.Amount}&vnp_TransactionNo={paymentResponse.TransactionId}";
        redirectUrl += $"&vnp_OrderInfo={Uri.EscapeDataString(paymentResponse.OrderDescription)}";
        redirectUrl += $"&paymentStatus={transaction.PaymentStatus}";

        return Redirect(redirectUrl);
        

    

            
            
        }

        [HttpGet]
        [Route("transactions")]
        public async Task<IActionResult> GetAllTransactions()
            => Ok(await _paymentRepo.GetAllTransactionsAsync());

        
}
