using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Entity;

public class Movie
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Title { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    public int Duration { get; set; }

    [Required]
    public string Director { get; set; }

    [Required]
    public string Cast { get; set; }

    [Required]
    public string Genre { get; set; }

    [Required]
    public DateTime ReleaseDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    public List<string> Languages { get; set; }

    public string? TrailerUrl { get; set; }

    public string? PosterUrl { get; set; }

    public ICollection<Showtime> Showtimes { get; set; }
    public List<MovieImage> Images { get; set; } = [];
}