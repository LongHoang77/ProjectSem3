using ProjectSm3.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectSm3.Repositories.Interface
{
    public interface IShopRepository
    {
        Task<Shop> AddAsync(Shop shop);
        Task<Shop> GetByIdAsync(int id);
        Task<IEnumerable<Shop>> GetAllAsync();
        Task UpdateAsync(Shop shop);
        Task DeleteAsync(int id);
    }
}