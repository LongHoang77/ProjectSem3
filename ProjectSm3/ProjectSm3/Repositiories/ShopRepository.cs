using Microsoft.EntityFrameworkCore;
using ProjectSm3.Data;
using ProjectSm3.Entity;
using ProjectSm3.Repositories.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectSm3.Repositories
{
    public class ShopRepository : IShopRepository
    {
        private readonly ApplicationDbContext _context;

        public ShopRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Shop> AddAsync(Shop shop)
        {
            await _context.Shops.AddAsync(shop);
            await _context.SaveChangesAsync();
            return shop;
        }

        public async Task<Shop> GetByIdAsync(int id)
        {
            return await _context.Shops.FindAsync(id);
        }

        public async Task<IEnumerable<Shop>> GetAllAsync()
        {
            return await _context.Shops.ToListAsync();
        }

        public async Task UpdateAsync(Shop shop)
        {
            _context.Shops.Update(shop);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var shop = await _context.Shops.FindAsync(id);
            if (shop != null)
            {
                _context.Shops.Remove(shop);
                await _context.SaveChangesAsync();
            }
        }
    }
}