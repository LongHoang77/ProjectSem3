using Microsoft.AspNetCore.Mvc;
using ProjectSm3.Entity;
using ProjectSm3.Service;
using ProjectSm3.Dto.Request;
using Microsoft.AspNetCore.Authorization;
namespace ProjectSm3.Controller
{
    [Route("api/ticket")]
    [ApiController]
    public class TicketTypeController : ControllerBase
    {
        private readonly TicketTypeService _ticketTypeService;

        public TicketTypeController(TicketTypeService ticketTypeService)
        {
            _ticketTypeService = ticketTypeService;
        }

        [HttpGet]
        [Route("alltickettypes")]
        public async Task<ActionResult<IEnumerable<TicketType>>> GetAllTicketTypes()
        {
            var ticketTypes = await _ticketTypeService.GetAllTicketTypesAsync();
            return Ok(ticketTypes);
        }

        [HttpGet("{id}")]
        [Route("getbyid")]
        public async Task<ActionResult<TicketType>> GetTicketType(int id)
        {
            var ticketType = await _ticketTypeService.GetTicketTypeByIdAsync(id);
            if (ticketType == null)
            {
                return NotFound();
            }
            return Ok(ticketType);
        }

        [HttpPost]
        [Route("create")]
        public async Task<ActionResult<TicketType>> CreateTicketType(TicketType ticketType)
        {
            var createdTicketType = await _ticketTypeService.CreateTicketTypeAsync(ticketType);
            return CreatedAtAction(nameof(GetTicketType), new { id = createdTicketType.Id }, createdTicketType);
        }

        [Route("update/{id}")]
        [HttpPut]
        
        
        public async Task<IActionResult> UpdateTicketType(int id, TicketType ticketType)
{
            if (id != ticketType.Id)
            {
                return BadRequest();
            }

            // Đảm bảo Price được set
            if (ticketType.Price <= 0)
            {
                return BadRequest("Price must be greater than 0");
            }

            await _ticketTypeService.UpdateTicketTypeAsync(ticketType);
            return NoContent();
}

        [Route("delete/{id}")]
        [HttpDelete]
        
        
        public async Task<IActionResult> DeleteTicketType(int id)
        {
            await _ticketTypeService.DeleteTicketTypeAsync(id);
            return NoContent();
        }
    }
}