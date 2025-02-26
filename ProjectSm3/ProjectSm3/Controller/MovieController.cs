using Microsoft.AspNetCore.Mvc;
using ProjectSm3.Service;
using ProjectSm3.Dto.Request;
using ProjectSm3.Dto.Request.Movie;
using ProjectSm3.Dto.Request.Showtime;
using ProjectSm3.Exception;

namespace ProjectSm3.Controller;

[ApiController]
[Route("api/[controller]")]
public class MovieController(MovieService movieService, ValidationService validationService) : ControllerBase
{
    [HttpGet("/Movie/{type}/{id:int}")]
    public async Task<IActionResult> MethodGet(string type, int id)
    {
        return type.ToLower() switch
        {
            "get" => Ok(await movieService.GetMovie(id)),
            "getshowtime" => Ok(await movieService.GetShowtime(id)),
            _ => BadRequest(new { Status = 404, Message = $"/{type} không tồn tại!!" })
        };
    }

    [HttpPost("/Movie/{type}")]
    public async Task<IActionResult> MethodPost(string type, [FromBody] object? payload)
    {
        IActionResult validationResult;
        switch (type.ToLower())
        {
            case "create":
                validationResult = validationService.ValidatePayload<CreateMovieRequest>(payload, out var createMovieRequest);
                return validationResult ?? Ok(await movieService.CreateMovie(createMovieRequest));
            case "createshowtime":
                validationResult = validationService.ValidatePayload<CreateShowtimeRequest>(payload, out var createShowtimeRequest);
                return validationResult ?? Ok(await movieService.CreateShowtime(createShowtimeRequest));
            default:
                return BadRequest(new { Status = 404, Message = $"/{type} không tồn tại !!" });
        }
    }

    [HttpPut("/Movie/{type}")]
    public async Task<IActionResult> MethodPut(string type, [FromBody] object? payload)
    {
        IActionResult validationResult;
        switch (type.ToLower())
        {
            case "update":
                validationResult =
                    validationService.ValidatePayload<UpdateMovieRequest>(payload, out var updateMovieRequest);
                return validationResult ?? Ok(await movieService.UpdateMovie(updateMovieRequest));
            case "updateshowtime":
                validationResult =
                    validationService.ValidatePayload<UpdateShowtimeRequest>(payload, out var updateShowtimeRequest);
                return validationResult ?? Ok(await movieService.UpdateShowtime(updateShowtimeRequest));
            default:
                return BadRequest(new { Status = 404, Message = $"/{type} không tồn tại !!" });
        }
    }
    [HttpDelete("/Movie/{type}/{id:int}")]
    public async Task<IActionResult> MethodDelete(string type, int id)
    {
        return type.ToLower() switch
        {
            "delete" => Ok(await movieService.DeleteMovie(id)),
            "deleteshowtime" => Ok(await movieService.DeleteShowtime(id)),
            _ => BadRequest(new { Status = 404, Message = $"/{type} không tồn tại!!" })
        };
    }
    [HttpGet("/Movie")]
    public async Task<IActionResult> GetAllMovies(
        [FromQuery] int page = 1, 
        [FromQuery] int limit = 10, 
        [FromQuery] bool activeOnly = false,
        [FromQuery] int? month = null,
        [FromQuery] int? year = null)
    {
        try
        {
            var (movies, totalPages, currentPage, totalMovies) = await movieService.GetAllMovies(page, limit, activeOnly, month, year);
            return Ok(new { 
                Movies = movies, 
                TotalPages = totalPages, 
                CurrentPage = currentPage,
                TotalMovies = totalMovies,
                Limit = limit,
                ActiveOnly = activeOnly,
                Month = month,
                Year = year
            });
        }
        catch (CustomException ex)
        {
            return StatusCode(ex.StatusCode, new { Status = ex.StatusCode, Message = ex.Message });
        }
    }
}