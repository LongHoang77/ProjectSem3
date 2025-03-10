using Microsoft.AspNetCore.Mvc;
using ProjectSm3.Dto;
using ProjectSm3.Service;
using System.Threading.Tasks;

namespace ProjectSm3.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodCourtController : ControllerBase
    {
        private readonly IFoodCourtService _service;

        public FoodCourtController(IFoodCourtService service)
        {
            _service = service;
        }

        [HttpPost]
        [Route("CreateFoodCourt")]
        public async Task<IActionResult> CreateFoodCourt([FromBody] FoodCourtDto foodCourtDto)
        {
            var result = await _service.CreateFoodCourt(foodCourtDto);
            return CreatedAtAction(nameof(GetFoodCourt), new { id = result.Id }, result);
        }

        [HttpGet]
        [Route("GetFoodCourt/{id}")]
        public async Task<IActionResult> GetFoodCourt(int id)
        {
            var foodCourt = await _service.GetFoodCourt(id);
            if (foodCourt == null)
                return NotFound();
            return Ok(foodCourt);
        }

        [HttpPut]
        [Route("UpdateFoodCourt/{id}")]
        public async Task<IActionResult> UpdateFoodCourt(int id, [FromBody] FoodCourtDto foodCourtDto)
        {
            if (id != foodCourtDto.Id)
                return BadRequest();
            await _service.UpdateFoodCourt(foodCourtDto);
            return NoContent();
        }

        [HttpDelete]
        [Route("DeleteFoodCourt/{id}")]
        public async Task<IActionResult> DeleteFoodCourt(int id)
        {
            await _service.DeleteFoodCourt(id);
            return NoContent();
        }

        [HttpGet]
        [Route("GetAllFoodCourts")]
        public async Task<ActionResult<IEnumerable<FoodCourtDto>>> GetAllFoodCourts()
        {
            var foodCourts = await _service.GetAllFoodCourts();
            return Ok(foodCourts);
        }
    }
}