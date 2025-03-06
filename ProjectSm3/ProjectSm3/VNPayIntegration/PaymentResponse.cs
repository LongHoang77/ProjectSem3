namespace ProjectSm3.VNPayIntegration
{
    public class PaymentResponse
    {
        public string OrderDescription { get; set; }
        public string TransactionId { get; set; }
        public string OrderId { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentId { get; set; }
        public bool Success { get; set; }
        public string Token { get; set; }
        public string VnPayResponseCode { get; set; }

        // Thêm các trường mới cho thông tin vé
        public int ShowtimeId { get; set; }
        public string TicketType { get; set; }
        public decimal Amount { get; set; }
        public string MovieTitle { get; set; }
        public string Showtime { get; set; }
    }
}
