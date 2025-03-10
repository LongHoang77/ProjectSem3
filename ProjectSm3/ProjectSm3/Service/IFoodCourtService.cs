using ProjectSm3.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectSm3.Service
{
    public interface IFoodCourtService
    {
        Task<FoodCourtDto> CreateFoodCourt(FoodCourtDto foodCourtDto);
        Task<FoodCourtDto> GetFoodCourt(int id);
        Task<IEnumerable<FoodCourtDto>> GetAllFoodCourts();
        Task UpdateFoodCourt(FoodCourtDto foodCourtDto);
        Task DeleteFoodCourt(int id);
    }
}