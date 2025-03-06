namespace ProjectSm3.Dto.Request
{
    public class PaymentRequest
    {
        public string OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string ReturnUrl { get; set; }
    }
}
