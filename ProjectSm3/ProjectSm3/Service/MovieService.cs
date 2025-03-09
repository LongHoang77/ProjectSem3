using ProjectSm3.Data;
using ProjectSm3.Entity;
using ProjectSm3.Dto.Request.Movie;
using ProjectSm3.Exception;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using ProjectSm3.Dto.Request.Showtime;
using ProjectSm3.Dto.Response;

namespace ProjectSm3.Service;

public class MovieService(ApplicationDbContext context, IWebHostEnvironment environment)
{
    private readonly IWebHostEnvironment environment = environment;

    public async Task<List<RoomInfo>> GetAllRooms()
        {
            try
            {
                var rooms = await context.Rooms
                    .Select(r => new RoomInfo
                    {
                        RoomId = r.RoomId,
                        RoomName = r.RoomName
                    })
                    .ToListAsync();

                if (!rooms.Any())
                {
                    throw new CustomException("Không có phòng chiếu nào trong cơ sở dữ liệu", 404);
                }

                return rooms;
            }
            catch (System.Exception ex)
            {
                throw new CustomException($"Lỗi khi lấy danh sách phòng chiếu: {ex.Message}");
            }
        }
    public async Task<int> GetActiveMoviesCount()
    {
        var currentDate = DateTime.Now.Date;
        return await context.Movies.CountAsync(m => m.ReleaseDate <= currentDate && m.EndDate >= currentDate);
    }
    public class RoomInfo
    {
        public int RoomId { get; set; }
        public string RoomName { get; set; }
    }

    public async Task<(IEnumerable<MovieResponse> Movies, int TotalPages, int CurrentPage, int TotalMovies)> GetAllMovies(
        int page = 1, 
        int limit = 10, 
        bool activeOnly = false, 
        int? month = null, 
        int? year = null)
    {
        if (page < 1)
        {
            throw new CustomException("Số trang phải lớn hơn hoặc bằng 1", 400);
        }

        if (limit < 1 || limit > 50)
        {
            throw new CustomException("Số lượng phim mỗi trang phải từ 1 đến 50", 400);
        }

        var currentDate = DateTime.Now.Date;

        var query = context.Movies.AsQueryable();

        if (activeOnly)
        {
            query = query.Where(m => m.ReleaseDate <= currentDate && m.EndDate >= currentDate);
        }

        if (month.HasValue && year.HasValue)
        {
            var startDate = new DateTime(year.Value, month.Value, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);
            query = query.Where(m => 
                (m.ReleaseDate <= endDate && m.EndDate >= startDate) || 
                (m.ReleaseDate.Month == month.Value && m.ReleaseDate.Year == year.Value) ||
                (m.EndDate.Month == month.Value && m.EndDate.Year == year.Value));
        }

        var totalMovies = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalMovies / (double)limit);

        if (totalPages > 0 && page > totalPages)
        {
            page = totalPages;
        }

        var movies = await query
            .OrderBy(m => m.ReleaseDate)
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(m => new MovieResponse
            {
                Id = m.Id,
                Title = m.Title,
                Description = m.Description,
                Duration = m.Duration,
                Director = m.Director,
                Cast = m.Cast,
                Genre = m.Genre,
                ReleaseDate = m.ReleaseDate,
                EndDate = m.EndDate,
                Languages = m.Languages,
                TrailerUrl = m.TrailerUrl,
                PosterUrl = m.PosterUrl,
                Status = m.EndDate >= currentDate ? "Active" : "Inactive"
            })
            .ToListAsync();

        return (movies, totalPages, page, totalMovies);
    }
    public async Task<MovieResponse> GetMovie(int id)
    {
        var currentDate = DateTime.Now.Date;
    
        var movie = await context.Movies
            .Include(m => m.Showtimes).ThenInclude(showtime => showtime.Room)
            .FirstOrDefaultAsync(m => m.Id == id);
    
        if (movie == null)
        {
            throw new CustomException("Phim không tồn tại", 404);
        }
    
        return new MovieResponse
        {
            Id = movie.Id,
            Title = movie.Title,
            Description = movie.Description,
            Duration = movie.Duration,
            Director = movie.Director,
            Cast = movie.Cast,
            Genre = movie.Genre,
            ReleaseDate = movie.ReleaseDate,
            EndDate = movie.EndDate,
            Languages = movie.Languages,
            TrailerUrl = movie.TrailerUrl,
            PosterUrl = movie.PosterUrl,
            Status = movie.EndDate >= currentDate ? "Active" : "Inactive"
        };
    }

    public async Task<ShowtimeResponse> GetShowtime(int id)
    {
        var showtime = await context.Showtimes
            .Include(s => s.Movie)
            .Include(s => s.Room)
            .FirstOrDefaultAsync(s => s.Id == id);
    
        if (showtime == null)
        {
            throw new CustomException("Xuất chiếu không tồn tại", 404);
        }
    
        return new ShowtimeResponse
        {
            Id = showtime.Id,
            MovieId = showtime.MovieId,
            MovieTitle = showtime.Movie.Title,
            RoomId = showtime.RoomId,
            RoomName = showtime.Room.RoomName,
            StartTime = showtime.StartTime,
            EndTime = showtime.EndTime,
            FormatMovie = showtime.FormatMovie,
            Status = showtime.Status
        };
    }

    
    public async Task<List<ShowtimeResponse>> GetAllShowtimesByMovieId(int movieId, DateTime? date = null)
    {
        var movie = await context.Movies.FindAsync(movieId);
        if (movie == null)
        {
            throw new CustomException("Phim không tồn tại", 404);
        }
    
        var query = context.Showtimes
            .Where(s => s.MovieId == movieId)
            .Include(s => s.Movie)
            .Include(s => s.Room)
            .AsQueryable();
    
        if (date.HasValue)
    {
        var utcDate = date.Value.ToUniversalTime();
        var startOfDay = utcDate.Date;
        var endOfDay = startOfDay.AddDays(1);

        query = query.Where(s => s.StartTime >= startOfDay && s.StartTime < endOfDay);
    }
    
        var showtimes = await query
            .OrderBy(s => s.StartTime)
            .ToListAsync();
    
        if (!showtimes.Any())
        {
            var errorMessage = date.HasValue 
                ? $"Không có suất chiếu nào cho phim này vào ngày {date.Value.ToString("dd/MM/yyyy")}"
                : "Không có suất chiếu nào cho phim này";
            throw new CustomException(errorMessage, 404);
        }
    
        return showtimes.Select(s => new ShowtimeResponse
        {
            Id = s.Id,
            MovieId = s.MovieId,
            MovieTitle = s.Movie.Title,
            RoomId = s.RoomId,
            RoomName = s.Room.RoomName,
            StartTime = s.StartTime,
            EndTime = s.EndTime,
            FormatMovie = s.FormatMovie,
            Status = s.Status
        }).ToList();
    }
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
        var movie = await context.Movies.FirstOrDefaultAsync(m => m.Id == request.Id);
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
    
    public async Task<string> CreateShowtime(CreateShowtimeRequest request)
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
            StartTime = request.StartTime.AddDays(-1),
            EndTime = endTime,
            FormatMovie = request.FormatMovie,
            Status = request.Status,
            MaxTickets = request.MaxTickets
        };
    
        context.Showtimes.Add(showtime);
        await context.SaveChangesAsync();
    
        return $"Tạo xuất chiếu thành công. ID xuất chiếu: {showtime.Id}";
    }

    public async Task<ShowtimeResponse> UpdateShowtime(UpdateShowtimeRequest request)
    {
        var showtime = await context.Showtimes
            .Include(s => s.Movie)
            .Include(s => s.Room)
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
    
        showtime.RoomId = request.RoomId;
        showtime.StartTime = request.StartTime;
        showtime.EndTime = endTime;
        showtime.FormatMovie = request.FormatMovie;
        showtime.Status = request.Status;
        showtime.MaxTickets = request.MaxTickets;
    
        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            throw new CustomException($"Lỗi khi cập nhật xuất chiếu: {ex.Message}");
        }
    
        return new ShowtimeResponse
        {
            Id = showtime.Id,
            MovieId = showtime.MovieId,
            MovieTitle = movie.Title,
            RoomId = showtime.RoomId,
            RoomName = room.RoomName,
            StartTime = showtime.StartTime,
            EndTime = showtime.EndTime,
            FormatMovie = showtime.FormatMovie,
            Status = showtime.Status
        };
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
private void ValidateMovieRequest(CreateMovieRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        throw new CustomException("Tiêu đề phim không được để trống");
    }

    if (request.Duration <= 0)
    {
        throw new CustomException("Thời lượng phim phải lớn hơn 0");
    }

    if (request.ReleaseDate >= request.EndDate)
    {
        throw new CustomException("Ngày phát hành phải trước ngày kết thúc");
    }
}

    private void ValidateMovieRequest(UpdateMovieRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            throw new CustomException("Tiêu đề phim không được để trống");
        }

        if (request.Duration <= 0)
        {
            throw new CustomException("Thời lượng phim phải lớn hơn 0");
        }

        if (request.ReleaseDate >= request.EndDate)
        {
            throw new CustomException("Ngày phát hành phải trước ngày kết thúc");
        }
    }

    private void ValidateShowtimeRequest(CreateShowtimeRequest request, Movie movie)
    {
        if (request.StartTime < movie.ReleaseDate || request.StartTime > movie.EndDate)
        {
            throw new CustomException("Thời gian chiếu phải nằm trong ngày phát hành và ngày kết thúc của phim");
        }
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


    public async Task<IEnumerable<ShowtimeResponse>> GetAllShowtimes(DateTime? startDate = null, DateTime? endDate = null)
{
    var query = context.Showtimes
        .Include(s => s.Movie)
        .Include(s => s.Room)
        .AsQueryable();

    if (startDate.HasValue)
    {
        query = query.Where(s => s.StartTime >= startDate.Value);
    }

    if (endDate.HasValue)
    {
        query = query.Where(s => s.StartTime <= endDate.Value);
    }

    var showtimes = await query
        .OrderBy(s => s.StartTime)
        .Select(s => new ShowtimeResponse
        {
            Id = s.Id,
            MovieId = s.MovieId,
            MovieTitle = s.Movie.Title,
            RoomId = s.RoomId,
            RoomName = s.Room.RoomName,
            StartTime = s.StartTime,
            EndTime = s.EndTime,
            FormatMovie = s.FormatMovie,
            MaxTickets = s.MaxTickets,
            Status = s.Status
        })
        .ToListAsync();

    return showtimes;
}
}