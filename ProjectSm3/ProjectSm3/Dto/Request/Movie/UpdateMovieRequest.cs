using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Dto.Request.Movie;

public class UpdateMovieRequest : CreateMovieRequest
{
    public int Id { get; set; }
}