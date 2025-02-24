using ProjectSm3.Data;
using ProjectSm3.Entity;
using ProjectSm3.Dto.Request.Movie;
using ProjectSm3.Exception;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using ProjectSm3.Dto.Request.Showtime;

namespace ProjectSm3.Service;

public class MovieService(ApplicationDbContext context, IWebHostEnvironment environment)
{

    public async Task<Movie> CreateMovie(CreateMovieRequest request)
    {
        ValidateMovieRequest(request);

        var movie = new Movie
        {
            Title = request.Title,
            Description = request.Description,
            Duration = request.Duration,
            Director = request.Director,
            Cast = request.Cast,
            Genre = request.Genre,
            ReleaseDate = request.ReleaseDate,
            EndDate = request.EndDate,
            Languages = request.Languages,
            TrailerUrl = request.TrailerUrl,
            PosterUrl = request.PosterUrl
        };

        if (request.Images != null && request.Images.Any())
        {
            movie.Images = await ProcessMovieImages(request.Images as IFormFileCollection);
        }

        try
        {
            context.Movies.Add(movie);
            await context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            throw new CustomException($"Lỗi khi lưu phim vào cơ sở dữ liệu: {ex.Message}");
        }

        return movie;
    }

    public async Task<Movie> UpdateMovie(UpdateMovieRequest request)
    {
        var movie = await context.Movies.Include(m => m.Images).FirstOrDefaultAsync(m => m.Id == request.Id);
        if (movie == null)
        {
            throw new CustomException("Phim không tồn tại", 404);
        }

        ValidateMovieRequest(request);

        movie.Title = request.Title;
        movie.Description = request.Description;
        movie.Duration = request.Duration;
        movie.Director = request.Director;
        movie.Cast = request.Cast;
        movie.Genre = request.Genre;
        movie.ReleaseDate = request.ReleaseDate;
        movie.EndDate = request.EndDate;
        movie.Languages = request.Languages;
        movie.TrailerUrl = request.TrailerUrl;
        movie.PosterUrl = request.PosterUrl;

        if (request.NewImages != null && request.NewImages.Any())
        {
            var newImages = await ProcessMovieImages(request.NewImages);
            movie.Images ??= new List<MovieImage>();
            movie.Images.AddRange(newImages);
        }

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            throw new CustomException($"Lỗi khi cập nhật phim: {ex.Message}");
        }

        return movie;
    }

    public async Task<bool> DeleteMovie(int id)
    {
        var movie = await context.Movies
            .Include(m => m.Showtimes)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (movie == null)
        {
            throw new CustomException("Phim không tồn tại", 404);
        }

        if (movie.Showtimes.Any())
        {
            throw new CustomException("Không thể xóa phim vì có các suất chiếu liên quan.", 400);
        }

        try
        {
            context.Movies.Remove(movie);
            await context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException ex)
        {
            throw new CustomException($"Lỗi khi xóa phim: {ex.Message}");
        }
    }
    
    public async Task<Showtime> CreateShowtime(CreateShowtimeRequest request)
    {
        var movie = await context.Movies.FindAsync(request.MovieId);
        if (movie == null)
        {
            throw new CustomException("Phim không tồn tại", 404);
        }

        var room = await context.Rooms.FindAsync(request.RoomId);
        if (room == null)
        {
            throw new CustomException("Phòng chiếu không tồn tại", 404);
        }

        ValidateShowtimeRequest(request, movie);

        var endTime = request.StartTime.AddMinutes(movie.Duration);

        await CheckShowtimeConflict(request, endTime);

        var showtime = new Showtime
        {
            MovieId = request.MovieId,
            RoomId = request.RoomId,
            StartTime = request.StartTime,
            EndTime = endTime,
            FormatMovie = request.FormatMovie,
            Status = "Active" 
        };

        try
        {
            context.Showtimes.Add(showtime);
            await context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            throw new CustomException($"Lỗi khi tạo xuất chiếu: {ex.Message}");
        }

        return showtime;
    }

    public async Task<Showtime> UpdateShowtime(UpdateShowtimeRequest request)
    {
        var showtime = await context.Showtimes
            .Include(s => s.Movie)
            .FirstOrDefaultAsync(s => s.Id == request.Id);

        if (showtime == null)
        {
            throw new CustomException("Xuất chiếu không tồn tại", 404);
        }

        var movie = await context.Movies.FindAsync(request.MovieId);
        if (movie == null)
        {
            throw new CustomException("Phim không tồn tại", 404);
        }

        var room = await context.Rooms.FindAsync(request.RoomId);
        if (room == null)
        {
            throw new CustomException("Phòng chiếu không tồn tại", 404);
        }

        ValidateShowtimeRequest(request, movie);

        var endTime = request.StartTime.AddMinutes(movie.Duration);

        await CheckShowtimeConflict(request, endTime);

        showtime.MovieId = request.MovieId;
        showtime.RoomId = request.RoomId;
        showtime.StartTime = request.StartTime;
        showtime.EndTime = endTime;
        showtime.FormatMovie = request.FormatMovie;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            throw new CustomException($"Lỗi khi cập nhật xuất chiếu: {ex.Message}");
        }

        return showtime;
    }
    public async Task<bool> DeleteShowtime(int id)
    {
        var showtime = await context.Showtimes
            .Include(s => s.Tickets)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (showtime == null)
        {
            throw new CustomException("Xuất chiếu không tồn tại", 404);
        }

        if (showtime.Tickets.Any())
        {
            throw new CustomException("Không thể xóa suất chiếu vì đã có vé được bán.", 400);
        }

        try
        {
            context.Showtimes.Remove(showtime);
            await context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException ex)
        {
            throw new CustomException($"Lỗi khi xóa xuất chiếu: {ex.Message}");
        }
    }

    private void ValidateShowtimeRequest(CreateShowtimeRequest request, Movie movie)
    {
        if (request.StartTime < movie.ReleaseDate || request.StartTime > movie.EndDate)
        {
            throw new CustomException("Thời gian chiếu phải nằm trong ngày phát hành và ngày kết thúc của phim");
        }
    }

    private void ValidateMovieRequest(CreateMovieRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            throw new CustomException("Tiêu đề phim không được để trống.");
        }

        if (request.Duration <= 0)
        {
            throw new CustomException("Thời lượng phim phải lớn hơn 0.");
        }

        if (request.ReleaseDate >= request.EndDate)
        {
            throw new CustomException("Ngày phát hành phải trước ngày kết thúc.");
        }
    }

    private async Task<List<MovieImage>> ProcessMovieImages(IFormFileCollection images)
    {
        var uploadPath = Path.Combine(environment.WebRootPath, "Upload", "Movies");
        Directory.CreateDirectory(uploadPath);

        var movieImages = new List<MovieImage>();

        foreach (var image in images)
        {
            if (image.Length <= 0) continue;
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploadPath, fileName);

            try
            {
                await using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                movieImages.Add(new MovieImage
                {
                    ImageUrl = "/Upload/Movies/" + fileName
                });
            }
            catch (System.Exception ex)
            {
                throw new CustomException($"Lỗi khi tải lên hình ảnh: {ex.Message}");
            }
        }

        return movieImages;
    }

    private void ValidateShowtimeRequest(UpdateShowtimeRequest request, Movie movie)
    {
        if (request.StartTime < movie.ReleaseDate || request.StartTime > movie.EndDate)
        {
            throw new CustomException("Thời gian chiếu phải nằm trong ngày phát hành và ngày kết thúc của phim");
        }
    }
    
    
    private async Task CheckShowtimeConflict(CreateShowtimeRequest request, DateTime endTime)
    {
        var conflictingShowtime = await context.Showtimes
            .Where(s => s.RoomId == request.RoomId)
            .Where(s => (s.StartTime <= request.StartTime && s.EndTime > request.StartTime) ||
                        (s.StartTime < endTime && s.EndTime >= endTime))
            .FirstOrDefaultAsync();

        if (conflictingShowtime != null)
        {
            throw new CustomException("Có một chương trình biểu diễn xung đột trong cùng một phòng");
        }
    }


    private async Task CheckShowtimeConflict(UpdateShowtimeRequest request, DateTime endTime)
    {
        var conflictingShowtime = await context.Showtimes
            .Where(s => s.Id != request.Id && s.RoomId == request.RoomId)
            .Where(s => (s.StartTime <= request.StartTime && s.EndTime > request.StartTime) ||
                        (s.StartTime < endTime && s.EndTime >= endTime))
            .FirstOrDefaultAsync();

        if (conflictingShowtime != null)
        {
            throw new CustomException("Có một chương trình biểu diễn xung đột trong cùng một phòng");
        }
    }
}