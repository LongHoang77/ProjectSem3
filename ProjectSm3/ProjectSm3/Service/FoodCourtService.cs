using ProjectSm3.Dto;
using ProjectSm3.Entity;
using ProjectSm3.Repositories.Interface;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectSm3.Service
{
    public class FoodCourtService : IFoodCourtService
    {
        private readonly IFoodCourtRepository _foodCourtRepository;

        public FoodCourtService(IFoodCourtRepository foodCourtRepository)
        {
            _foodCourtRepository = foodCourtRepository;
        }

        public async Task<FoodCourtDto> CreateFoodCourt(FoodCourtDto foodCourtDto)
        {
            var foodCourt = new FoodCourt
            {
                Name = foodCourtDto.Name,
                Description = foodCourtDto.Description,
                Location = foodCourtDto.Location,
                OpenTime = foodCourtDto.OpenTime,
                CloseTime = foodCourtDto.CloseTime
            };

            await _foodCourtRepository.AddAsync(foodCourt);
            foodCourtDto.Id = foodCourt.Id;
            return foodCourtDto;
        }

        public async Task<FoodCourtDto> GetFoodCourt(int id)
        {
            var foodCourt = await _foodCourtRepository.GetByIdAsync(id);
            return foodCourt == null ? null : MapToDto(foodCourt);
        }

        public async Task<IEnumerable<FoodCourtDto>> GetAllFoodCourts()
        {
            var foodCourts = await _foodCourtRepository.GetAllAsync();
            return foodCourts.Select(MapToDto);
        }

        public async Task UpdateFoodCourt(FoodCourtDto foodCourtDto)
        {
            var foodCourt = await _foodCourtRepository.GetByIdAsync(foodCourtDto.Id);
            if (foodCourt != null)
            {
                foodCourt.Name = foodCourtDto.Name;
                foodCourt.Description = foodCourtDto.Description;
                foodCourt.Location = foodCourtDto.Location;
                foodCourt.OpenTime = foodCourtDto.OpenTime;
                foodCourt.CloseTime = foodCourtDto.CloseTime;

                await _foodCourtRepository.UpdateAsync(foodCourt);
            }
        }

        public async Task DeleteFoodCourt(int id)
        {
            await _foodCourtRepository.DeleteAsync(id);
        }

        private FoodCourtDto MapToDto(FoodCourt foodCourt)
        {
            return new FoodCourtDto
            {
                Id = foodCourt.Id,
                Name = foodCourt.Name,
                Description = foodCourt.Description,
                Location = foodCourt.Location,
                OpenTime = foodCourt.OpenTime,
                CloseTime = foodCourt.CloseTime
            };
        }
    }
}