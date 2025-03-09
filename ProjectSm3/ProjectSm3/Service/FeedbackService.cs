using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjectSm3.Data;
using ProjectSm3.Dto.Request;
using ProjectSm3.Dto.Response;
using ProjectSm3.Entity;

namespace ProjectSm3.Service
{
    public class FeedbackService : IFeedbackService
    {
        private readonly ApplicationDbContext _context;

        public FeedbackService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Feedback> CreateFeedbackAsync(FeedbackRequest request)
        {
            var feedback = new Feedback
            {
                
                Name = request.Name,
                Email = request.Email,
                Content = request.Content
                // Thêm các trường khác nếu cần
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return feedback;
        }

        public async Task<IEnumerable<FeedbackResponse>> GetAllFeedbacksAsync()
        {
            var feedbacks = await _context.Feedbacks.ToListAsync();
            return feedbacks.Select(f => new FeedbackResponse
            {
                Id = f.Id,
                Name = f.Name,
                Email = f.Email,
                Content = f.Content
                // Thêm các trường khác nếu cần
            });
        }

        public async Task<bool> DeleteFeedbackAsync(int id)
        {
            var feedback = await _context.Feedbacks.FindAsync(id);
            if (feedback == null)
            {
                return false;
            }

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}