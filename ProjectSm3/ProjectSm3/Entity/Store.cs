using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Entity;

public class Store
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Address { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Status { get; set; }
    
    public ICollection<Feedback> Feedbacks { get; set; }
    public ICollection<Blog> Blogs { get; set; }
    public ICollection<Staff> Staffs { get; set; }
}