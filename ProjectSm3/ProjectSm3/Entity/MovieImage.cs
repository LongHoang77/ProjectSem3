using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectSm3.Entity;

public class MovieImage
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string ImageUrl { get; set; }

    [ForeignKey("Movie")]
    public int MovieId { get; set; }

    public virtual Movie Movie { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}