using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectSm3.Entity;

public class Staff
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Position { get; set; }
    
    [Required]
    [StringLength(100)]
    public string StoreName { get; set; }
    
    public int? MovieId { get; set; }
    
    public int StoreId { get; set; }
    
    [ForeignKey("StoreId")]
    public Store Store { get; set; }
}