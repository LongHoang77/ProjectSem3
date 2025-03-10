using ProjectSm3.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectSm3.Repositories.Interface
{
    public interface IFoodCourtRepository
    {
        Task<FoodCourt> AddAsync(FoodCourt foodCourt);
        Task<FoodCourt> GetByIdAsync(int id);
        Task<IEnumerable<FoodCourt>> GetAllAsync();
        Task UpdateAsync(FoodCourt foodCourt);
        Task DeleteAsync(int id);
    }
}