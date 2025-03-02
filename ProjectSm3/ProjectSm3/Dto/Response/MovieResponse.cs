using System;
using System.Collections.Generic;

namespace ProjectSm3.Dto.Response;

public class MovieResponse
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int Duration { get; set; }
    public string Director { get; set; }
    public string Cast { get; set; }
    public string Genre { get; set; }
    public DateTime ReleaseDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<string> Languages { get; set; }
    public string TrailerUrl { get; set; }
    public string PosterUrl { get; set; }
    public string Status { get; set; }
}