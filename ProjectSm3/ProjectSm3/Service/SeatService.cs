using Microsoft.EntityFrameworkCore;
using ProjectSm3.Data;
using ProjectSm3.Entity;
using ProjectSm3.Exception;
using System.Linq;

namespace ProjectSm3.Service;

public class SeatService(ApplicationDbContext context)
{
    public async Task<object> GetSeats(int roomId)
    {
        var existingSeats = await context.Seats
            .Where(s => s.RoomId == roomId)
            .OrderBy(s => s.RowNumber)
            .ThenBy(s => s.ColNumber)
            .ToListAsync();

        if (!existingSeats.Any())
        {
            await CreateSeats(roomId);
            existingSeats = await context.Seats
                .Where(s => s.RoomId == roomId)
                .OrderBy(s => s.RowNumber)
                .ThenBy(s => s.ColNumber)
                .ToListAsync();
        }

        var seatMap = new List<string>();
        var seatIdMap = new List<string>();
        for (var row = 0; row < 10; row++)
        {
            var rowChar = (char)('A' + row);
            var rowSeats = new List<string>();
            var rowSeatIds = new List<string>();
            var seatsInRow = existingSeats.Where(s => s.RowNumber == row + 1).OrderBy(s => s.ColNumber).ToList();

            for (var col = 0; col < 15; col++)
            {
                var seat = seatsInRow.FirstOrDefault(s => s.ColNumber == col + 1);
                if (seat == null || seat.SeatLock)
                {
                    rowSeats.Add("X");
                    rowSeatIds.Add("X");
                }
                else
                {
                    rowSeats.Add($"{rowChar}{col + 1}");
                    rowSeatIds.Add(seat.Id.ToString());
                }
            }

            seatMap.Add(string.Join(",", rowSeats));
            seatIdMap.Add(string.Join(",", rowSeatIds));
        }

        return new
        {
            SeatMap = seatMap,
            SeatIdMap = seatIdMap
        };
    }

    private async Task CreateSeats(int roomId)
    {
        const int rowNumber = 10;
        const int columnNumber = 15;
        var seats = new List<Seat>();
        for (var row = 0; row < rowNumber; row++)
        {
            for (var col = 1; col <= columnNumber; col++)
            {
                var seatType = row switch
                {
                    < 3 => "Ghế Thường",
                    < 8 => "Ghế Vip",
                    _ => "Ghế đôi"
                };
                var seat = new Seat
                {
                    RoomId = roomId,
                    RowNumber = row + 1,
                    ColNumber = col,
                    Status = $"{(char)('A' + row)}{col}",
                    SeatType = seatType,
                    SeatLock = false
                };
                seats.Add(seat);
            }
        }
        await context.Seats.AddRangeAsync(seats);
        await context.SaveChangesAsync();
    }

    public async Task<List<Seat>> BlockSeat(int seatId, List<int>? additionalSeatIds = null)
    {
        var seatIds = new List<int> { seatId };
        if (additionalSeatIds != null)
        {
            seatIds.AddRange(additionalSeatIds);
        }
        var seats = await context.Seats.Where(s => seatIds.Contains(s.Id)).ToListAsync();
        if (seats.Count != seatIds.Count)
        {
            throw new CustomException("Ghế không tìm thấy.", 404);
        }
        var firstSeatIsLocked = seats[0].SeatLock == true;
        if (seats.Any(s => s.SeatLock != firstSeatIsLocked))
        {
            throw new CustomException("Tất cả các ghế phải có cùng trạng thái khóa trước khi thay đổi.", 400);
        }
        foreach (var seat in seats)
        {
            seat.SeatLock = !seat.SeatLock;
            if (seat.SeatLock == true)
            {
                seat.Status = "X";
                seat.SeatLockTime = DateTime.Now;
            }
            else
            {
                seat.Status = $"{(char)('A' + seat.RowNumber - 1)}{seat.ColNumber}";
                seat.SeatLockTime = null;
            }
        }
        await context.SaveChangesAsync();
        return seats;
    }
}