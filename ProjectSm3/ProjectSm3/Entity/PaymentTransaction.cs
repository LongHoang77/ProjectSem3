using System;
using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Entities
{
    public class PaymentTransaction
    {
        [Key]
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string TransactionId { get; set; }
        public string OrderDescription { get; set; }
        public string PaymentStatus { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}