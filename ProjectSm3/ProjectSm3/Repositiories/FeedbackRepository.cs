using System.Threading.Tasks;
using ProjectSm3.Data;
using ProjectSm3.Entity;
using ProjectSm3.Repositories.Interface;

namespace ProjectSm3.Repositories
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly ApplicationDbContext _context;

        public FeedbackRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Feedback> CreateFeedbackAsync(Feedback feedback)
        {
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return feedback;
        }
    }
}