namespace ProjectSm3.VNPayIntegration
{
    public class PaymentInformation
    {
        public string OrderType { get; set; }
        public double Amount { get; set; }
        public string OrderDescription { get; set; }
        public string Name { get; set; }
        public string ReturnUrl { get; set; }

        public string OrderId { get; set; }

        public int ShowtimeId { get; set; }
        public string TicketType { get; set; }
        
        public string MovieTitle { get; set; }
        public string Showtime { get; set; }
        public string RedirectUrl { get; internal set; }
    }
}
