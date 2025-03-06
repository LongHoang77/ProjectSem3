using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProjectSm3.Dto.Request;

[Route("api/payment")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly VnpayService _vnpayService;

    public PaymentController(VnpayService vnpayService)
    {
        _vnpayService = vnpayService;
    }

    [HttpPost("create-payment")]
    public IActionResult CreatePayment([FromBody] PaymentRequest model)
    {
        string paymentUrl = _vnpayService.CreatePaymentUrl(model, HttpContext);
        return Ok(new { PaymentUrl = paymentUrl });
    }
}
