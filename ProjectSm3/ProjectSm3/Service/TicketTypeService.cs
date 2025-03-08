using ProjectSm3.Entity;
using ProjectSm3.Repositories.Interface;

namespace ProjectSm3.Service
{
    public class TicketTypeService
    {
        private readonly ITicketTypeRepository _ticketTypeRepository;

        public TicketTypeService(ITicketTypeRepository ticketTypeRepository)
        {
            _ticketTypeRepository = ticketTypeRepository;
        }

        public async Task<IEnumerable<TicketType>> GetAllTicketTypesAsync()
        {
            return await _ticketTypeRepository.GetAllAsync();
        }

        public async Task<TicketType> GetTicketTypeByIdAsync(int id)
        {
            return await _ticketTypeRepository.GetByIdAsync(id);
        }

        public async Task<TicketType> CreateTicketTypeAsync(TicketType ticketType)
        {
            return await _ticketTypeRepository.CreateAsync(ticketType);
        }

        public async Task<TicketType> UpdateTicketTypeAsync(TicketType ticketType)
        {
            return await _ticketTypeRepository.UpdateAsync(ticketType);
        }

        public async Task DeleteTicketTypeAsync(int id)
        {
            await _ticketTypeRepository.DeleteAsync(id);
        }
    }
}