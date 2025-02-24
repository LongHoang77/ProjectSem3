using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Entity;

public class User
{
    [Key] 
    public int Id { get; set; }
    [Required] 
    public string Email { get; set; }
    [Required] 
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
    [Required] 
    public DateTime CreateDate { get; set; }
    
    public ICollection<Ticket> Tickets { get; set; }
}