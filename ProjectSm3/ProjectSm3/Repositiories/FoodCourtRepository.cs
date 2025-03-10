using Microsoft.EntityFrameworkCore;
using ProjectSm3.Data;
using ProjectSm3.Entity;
using ProjectSm3.Repositories.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectSm3.Repositories
{
    public class FoodCourtRepository : IFoodCourtRepository
    {
        private readonly ApplicationDbContext _context;

        public FoodCourtRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FoodCourt> AddAsync(FoodCourt foodCourt)
        {
            await _context.FoodCourts.AddAsync(foodCourt);
            await _context.SaveChangesAsync();
            return foodCourt;
        }

        public async Task<FoodCourt> GetByIdAsync(int id)
        {
            return await _context.FoodCourts.FindAsync(id);
        }

        public async Task<IEnumerable<FoodCourt>> GetAllAsync()
        {
            return await _context.FoodCourts.ToListAsync();
        }

        public async Task UpdateAsync(FoodCourt foodCourt)
        {
            _context.FoodCourts.Update(foodCourt);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var foodCourt = await _context.FoodCourts.FindAsync(id);
            if (foodCourt != null)
            {
                _context.FoodCourts.Remove(foodCourt);
                await _context.SaveChangesAsync();
            }
        }
    }
}