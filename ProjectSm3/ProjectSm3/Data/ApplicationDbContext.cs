using Microsoft.EntityFrameworkCore;
using ProjectSm3.Entity;
using ProjectSm3.Dto.Database;

namespace ProjectSm3.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public required DbSet<Movie> Movies { get; init; }
    public required DbSet<Showtime> Showtimes { get; init; }
    public required DbSet<Ticket> Tickets { get; init; }
    public required DbSet<Seat> Seats { get; init; }
    public required DbSet<Room> Rooms { get; init; }
    public required DbSet<User> Users { get; init; }
    public required DbSet<Payment> Payments { get; init; }

     public required DbSet<TicketType> TicketTypes { get; init; }

    public  DbSet<PaymentTransactionDto> PaymentTransactions { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Movie>()
            .HasMany(m => m.Showtimes)
            .WithOne(s => s.Movie)
            .HasForeignKey(s => s.MovieId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Showtime>()
            .HasMany(s => s.Tickets)
            .WithOne(t => t.Showtime)
            .HasForeignKey(t => t.ShowtimeId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Showtime>()
            .HasOne(s => s.Room)
            .WithMany(r => r.Showtimes)
            .HasForeignKey(s => s.RoomId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.Seat)
            .WithMany()
            .HasForeignKey(t => t.SeatId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.Payment)
            .WithOne(p => p.Ticket)
            .HasForeignKey<Payment>(p => p.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Room>()
            .HasMany(r => r.Seats)
            .WithOne(s => s.Room)
            .HasForeignKey(s => s.RoomId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Tickets)
            .WithOne(t => t.User)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ticket>()
            .Property(t => t.Price)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<PaymentTransactionDto>()
            .Property(p => p.Amount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<TicketType>()
            .Property(tt => tt.Price)
            .HasColumnType("decimal(18,2)");

        
    }
}