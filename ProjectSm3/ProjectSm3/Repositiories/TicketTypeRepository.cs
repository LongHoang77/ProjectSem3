using Microsoft.EntityFrameworkCore;
using ProjectSm3.Data;
using ProjectSm3.Entity;
using ProjectSm3.Repositories.Interface;

namespace ProjectSm3.Repositories
{
    public class TicketTypeRepository : ITicketTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public TicketTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TicketType>> GetAllAsync()
        {
            return await _context.TicketTypes.ToListAsync();
        }

        public async Task<TicketType> GetByIdAsync(int id)
        {
            return await _context.TicketTypes.FindAsync(id);
        }

        public async Task<TicketType> CreateAsync(TicketType ticketType)
        {
            _context.TicketTypes.Add(ticketType);
            await _context.SaveChangesAsync();
            return ticketType;
        }

        public async Task<TicketType> UpdateAsync(TicketType ticketType)
        {
            _context.Entry(ticketType).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return ticketType;
        }

        public async Task DeleteAsync(int id)
        {
            var ticketType = await _context.TicketTypes.FindAsync(id);
            if (ticketType != null)
            {
                _context.TicketTypes.Remove(ticketType);
                await _context.SaveChangesAsync();
            }
        }
    }
}