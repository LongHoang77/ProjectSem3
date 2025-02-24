using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ProjectSm3.Dto.Request.Movie;

public class CreateMovieRequest
{
    [Required(ErrorMessage = "Tiêu đề là bắt buộc")]
    [StringLength(200, ErrorMessage = "Tiêu đề không được vượt quá 200 ký tự")]
    public string Title { get; set; }

    [Required(ErrorMessage = "Mô tả là bắt buộc")]
    public string Description { get; set; }

    [Required(ErrorMessage = "Thời lượng là bắt buộc")]
    [Range(1, int.MaxValue, ErrorMessage = "Thời lượng phải lớn hơn 0")]
    public int Duration { get; set; }

    [Required(ErrorMessage = "Đạo diễn là bắt buộc")]
    public string Director { get; set; }

    [Required(ErrorMessage = "Diễn viên là bắt buộc")]
    public string Cast { get; set; }

    [Required(ErrorMessage = "Thể loại là bắt buộc")]
    public string Genre { get; set; }

    [Required(ErrorMessage = "Ngày phát hành là bắt buộc")]
    public DateTime ReleaseDate { get; set; }

    [Required(ErrorMessage = "Ngày kết thúc là bắt buộc")]
    public DateTime EndDate { get; set; }

    [Required(ErrorMessage = "Ngôn ngữ là bắt buộc")]
    public List<string> Languages { get; set; }

    [Url(ErrorMessage = "URL trailer không hợp lệ")]
    public string? TrailerUrl { get; set; }

    [Url(ErrorMessage = "URL poster không hợp lệ")]
    public string? PosterUrl { get; set; }

    public List<IFormFile>? Images { get; set; }
}