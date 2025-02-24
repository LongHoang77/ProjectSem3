using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectSm3.Entity;

public class Feedback
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string UserName { get; set; }
    
    public int? UserPhone { get; set; }
    
    [StringLength(100)]
    public string? UserEmail { get; set; }
    
    [Required]
    public int StoreReview { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Evaluate { get; set; }
    
    [Required]
    public string Content { get; set; }
    
    public int? StoreId { get; set; }
    
    [ForeignKey("StoreId")]
    public Store Store { get; set; }
}