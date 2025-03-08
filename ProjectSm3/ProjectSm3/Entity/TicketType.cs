using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Entity
{
    public class TicketType
    {
        public int Id { get; set; }
        
        
        public string Name { get; set; }
        
        [Required]
        public decimal Price { get; set; }
        
        public string Description { get; set; }
    }
}