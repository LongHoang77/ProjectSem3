using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectSm3.Entity;

public class Blog
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string MainTitle { get; set; }
    
    [StringLength(200)]
    public string Image { get; set; }
    
    public string Information { get; set; }
    
    [Required]
    [StringLength(100)]
    public string EmployeeName { get; set; }
    
    [Required]
    public DateTime DatePosted { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Status { get; set; }
    
    [StringLength(200)]
    public string Keywords { get; set; }
    
    public int StoreId { get; set; }
    
    [ForeignKey("StoreId")]
    public Store Store { get; set; }
}