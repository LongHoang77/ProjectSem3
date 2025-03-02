using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Entity;

public class Movie
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public required string Title { get; set; }

    [Required]
    [StringLength(1000)]  
    public required string Description { get; set; }

    [Required]
    public int Duration { get; set; }

    [Required]
    [StringLength(100)]
    public required string Director { get; set; }

    [Required]
    [StringLength(500)]
    public required string Cast { get; set; }

    [Required]
    [StringLength(100)]
    public required string Genre { get; set; }

    [Required]
    public DateTime ReleaseDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    public required List<string> Languages { get; set; } = new();

    [StringLength(2000)]
    public string? TrailerUrl { get; set; }

    [StringLength(2000)]
    public string? PosterUrl { get; set; }

    public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
}