namespace ProjectSm3.Dto.Request
{
    public class PaymentRequest
    {
        public string Showtime { get; set; }
        public string TicketType { get; set; }
        public int Amount { get; set; } // Nhận giá trị từ frontend
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
