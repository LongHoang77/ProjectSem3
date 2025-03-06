using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProjectSm3.Dto.Request;
using ProjectSm3.Repositories.Interface;
using ProjectSm3.VNPayIntegration;


namespace ProjectSm3.Controller;



[Route("api/payment")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly VnpayService _vnpayService;
    private readonly IVnPayServiceRepo _vnPayService;
    private readonly IConfiguration _configuration;

    public PaymentController(VnpayService vnpayService, IVnPayServiceRepo vnPayService, IConfiguration configuration)
    {
        _vnpayService = vnpayService;
        _vnPayService = vnPayService;
        _configuration = configuration;
    }

    // [HttpPost("create-payment")]
    // public IActionResult CreatePayment([FromBody] PaymentRequest model)
    // {
    //     PaymentInformation paymentInformation = new PaymentInformation();
    //     paymentInformation.Name = "Order";
    //     paymentInformation.OrderDescription = $"Payment for order VXBO{1}";
    //     paymentInformation.OrderType = "other";
    //     paymentInformation.Amount = 1* 100;
    //     paymentInformation.ReturnUrl ="/api/payment";
    //     return Ok(_vnPayService.CreatePaymentUrl(paymentInformation, HttpContext)
    //     );

    // }
    [HttpPost]
    [Route("pay")]

    public IActionResult CreatePayment()
    {
    

    PaymentInformation paymentInformation = new PaymentInformation
    {
        Name = $"Vé xem phim",
        OrderDescription = $"Thanh toán vé xem phim - Suất chiếu: ",
        OrderType = "200000",
        Amount = 100000, // VNPay yêu cầu nhân 100
        ReturnUrl = "http://localhost:5000/api/payment/return"
    };  

    var paymentUrl = _vnPayService.CreatePaymentUrl(paymentInformation, HttpContext);
    Console.WriteLine($"VNPay URL: {paymentUrl}"); // Log URL để debug

    return Ok(new { paymentUrl });
}

    


    
}

