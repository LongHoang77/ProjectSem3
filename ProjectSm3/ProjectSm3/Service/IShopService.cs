using ProjectSm3.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectSm3.Service
{
    public interface IShopService
    {
        Task<ShopDto> CreateShop(ShopDto shopDto);
        Task<ShopDto> GetShop(int id);
        Task<IEnumerable<ShopDto>> GetAllShops();
        Task UpdateShop(ShopDto shopDto);
        Task DeleteShop(int id);
    }
}