using ProjectSm3.Entity;

namespace ProjectSm3.Repositories.Interface
{
    public interface ITicketTypeRepository
    {
        Task<IEnumerable<TicketType>> GetAllAsync();
        Task<TicketType> GetByIdAsync(int id);
        Task<TicketType> CreateAsync(TicketType ticketType);
        Task<TicketType> UpdateAsync(TicketType ticketType);
        Task DeleteAsync(int id);
    }
}