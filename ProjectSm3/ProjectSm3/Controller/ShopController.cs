using Microsoft.AspNetCore.Mvc;
using ProjectSm3.Dto;
using ProjectSm3.Service;
using System.Threading.Tasks;

namespace ProjectSm3.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShopController : ControllerBase
    {
        private readonly IShopService _service;

        public ShopController(IShopService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateShop([FromBody] ShopDto shopDto)
        {
            var result = await _service.CreateShop(shopDto);
            return CreatedAtAction(nameof(GetShop), new { id = result.Id }, result);
        }

        [HttpGet]
        [Route("GetShop/{id}")]
        public async Task<IActionResult> GetShop(int id)
        {
            var shop = await _service.GetShop(id);
            if (shop == null)
                return NotFound();
            return Ok(shop);
        }

        [HttpPut]
        [Route("UpdateShop/{id}")]
        public async Task<IActionResult> UpdateShop(int id, [FromBody] ShopDto shopDto)
        {
            if (id != shopDto.Id)
                return BadRequest();
            await _service.UpdateShop(shopDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Route("DeleteShop")]
        public async Task<IActionResult> DeleteShop(int id)
        {
            await _service.DeleteShop(id);
            return NoContent();
        }

        [HttpGet]
        [Route("GetAllShops")]
        public async Task<ActionResult<IEnumerable<ShopDto>>> GetAllShops()
        {
            var shops = await _service.GetAllShops();
            if (shops == null || !shops.Any())
            {
                return NotFound("No shops found.");
            }
            return Ok(shops);
        }
    }
}