﻿ using Microsoft.EntityFrameworkCore;
using ProjectSm3.Data;
using ProjectSm3.Entity;
using ProjectSm3.Exception;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectSm3.Service;

public class SeatService
{
    private readonly ApplicationDbContext context;

    public SeatService(ApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<object> GetSeats(int roomId)
    {
        if (roomId is < 1 or > 3)
        {
            throw new CustomException($"Phòng với ID {roomId} không hợp lệ. Chỉ chấp nhận ID từ 1 đến 3.", 400);
        }

        await EnsureDefaultRoomsExist();

        var room = await context.Rooms.FindAsync(roomId);
        if (room == null)
        {
            throw new CustomException($"Phòng với ID {roomId} không tồn tại.", 404);
        }

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

            var availableSeatCount = 1;
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
                    rowSeats.Add($"{rowChar}{availableSeatCount}");
                    rowSeatIds.Add(seat.Id.ToString());
                    availableSeatCount++;
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

    public async Task<object> BlockSeat(List<int> seatIds)
    {
        if (seatIds == null || !seatIds.Any())
        {
            throw new CustomException("Danh sách ghế không được để trống.", 400);
        }

        var seats = await context.Seats.Where(s => seatIds.Contains(s.Id)).ToListAsync();

        if (seats.Count != seatIds.Count)
        {
            var missingIds = seatIds.Except(seats.Select(s => s.Id));
            throw new CustomException($"Ghế không tìm thấy. Missing IDs: {string.Join(", ", missingIds)}", 404);
        }

        var initialLockState = seats[0].SeatLock;

        if (seats.Any(s => s.SeatLock != initialLockState))
        {
            throw new CustomException("Tất cả các ghế phải có cùng trạng thái (khóa hoặc không khóa).", 400);
        }

        var changedSeats = new List<string>();
        foreach (var seat in seats)
        {
            seat.SeatLock = !seat.SeatLock;
            if (seat.SeatLock)
            {
                seat.Status = "X";
                seat.SeatLockTime = DateTime.Now;
            }
            else
            {
                seat.Status = $"{(char)('A' + seat.RowNumber - 1)}{seat.ColNumber}";
                seat.SeatLockTime = null;
            }
            changedSeats.Add($"{(char)('A' + seat.RowNumber - 1)}{seat.ColNumber}");
        }

        await context.SaveChangesAsync();

        return new
        {
            Success = true,
            ChangedSeats = changedSeats,
            Action = initialLockState ? "Unblocked" : "Blocked"
        };
    }
    private async Task EnsureDefaultRoomsExist()
    {
        var defaultRooms = new List<Room>
        {
            new Room { RoomId = 1, RoomName = "Room A", NumberOfColumns = 15, NumberOfRows = 10, Capacity = 150 },
            new Room { RoomId = 2, RoomName = "Room B", NumberOfColumns = 15, NumberOfRows = 10, Capacity = 150 },
            new Room { RoomId = 3, RoomName = "Room C", NumberOfColumns = 15, NumberOfRows = 10, Capacity = 150 }
        };

        foreach (var room in defaultRooms)
        {
            var existingRoom = await context.Rooms.FindAsync(room.RoomId);
            if (existingRoom == null)
            {
                context.Rooms.Add(room);
            }
        }

        await context.SaveChangesAsync();
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
}