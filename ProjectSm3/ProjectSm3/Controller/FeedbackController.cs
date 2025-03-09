using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProjectSm3.Dto.Request;
using ProjectSm3.Service;

namespace ProjectSm3.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpPost]
        [Route("CreateFeedback")]
        public async Task<IActionResult> CreateFeedback([FromBody] FeedbackRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var feedback = await _feedbackService.CreateFeedbackAsync(request);
            return CreatedAtAction(nameof(CreateFeedback), new { id = feedback.Id }, feedback);
        }

        [HttpGet]
        [Route("GetAllFeedbacks")]
        public async Task<IActionResult> GetAllFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllFeedbacksAsync();
                return Ok(feedbacks);
            }
            catch (System.Exception)
            {
                // Log the exception
                return StatusCode(500, "An error occurred while retrieving feedbacks.");
            }
        }

        [HttpDelete]
        [Route("DeleteFeedback/{id}")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            try
            {
                var result = await _feedbackService.DeleteFeedbackAsync(id);
                if (result)
                {
                    return Ok(new { message = "Feedback deleted successfully" });
                }
                else
                {
                    return NotFound(new { message = "Feedback not found" });
                }
            }
            catch (System.Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { message = "An error occurred while deleting the feedback", error = ex.Message });
            }
        }

        
    }
}