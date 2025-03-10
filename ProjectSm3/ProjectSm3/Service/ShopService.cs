using ProjectSm3.Dto;
using ProjectSm3.Entity;
using ProjectSm3.Repositories.Interface;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectSm3.Service
{
    public class ShopService : IShopService
    {
        private readonly IShopRepository _shopRepository;
        

        public ShopService(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<ShopDto> CreateShop(ShopDto shopDto)
        {
            var shop = new Shop
            {
                Name = shopDto.Name,
                Description = shopDto.Description,
                Location = shopDto.Location,
                OpenTime = shopDto.OpenTime,
                CloseTime = shopDto.CloseTime,
                OwnerName = shopDto.OwnerName,
                ContactNumber = shopDto.ContactNumber
            };

            await _shopRepository.AddAsync(shop);
            shopDto.Id = shop.Id;
            return shopDto;
        }

        public async Task<ShopDto> GetShop(int id)
        {
            var shop = await _shopRepository.GetByIdAsync(id);
            return shop == null ? null : MapToDto(shop);
        }

        public async Task<IEnumerable<ShopDto>> GetAllShops()
        {
            var shops = await _shopRepository.GetAllAsync();
            return shops.Select(MapToDto);
        }

        public async Task UpdateShop(ShopDto shopDto)
        {
            var shop = await _shopRepository.GetByIdAsync(shopDto.Id);
            if (shop != null)
            {
                shop.Name = shopDto.Name;
                shop.Description = shopDto.Description;
                shop.Location = shopDto.Location;
                shop.OpenTime = shopDto.OpenTime;
                shop.CloseTime = shopDto.CloseTime;
                shop.OwnerName = shopDto.OwnerName;
                shop.ContactNumber = shopDto.ContactNumber;

                await _shopRepository.UpdateAsync(shop);
            }
        }

        public async Task DeleteShop(int id)
        {
            await _shopRepository.DeleteAsync(id);
        }

        private ShopDto MapToDto(Shop shop)
        {
            return new ShopDto
            {
                Id = shop.Id,
                Name = shop.Name,
                Description = shop.Description,
                Location = shop.Location,
                OpenTime = shop.OpenTime,
                CloseTime = shop.CloseTime,
                OwnerName = shop.OwnerName,
                ContactNumber = shop.ContactNumber
            };
        }

        
    }
}