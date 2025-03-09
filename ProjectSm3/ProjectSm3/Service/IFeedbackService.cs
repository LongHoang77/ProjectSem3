using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectSm3.Dto.Request;
using ProjectSm3.Dto.Response;
using ProjectSm3.Entity;

namespace ProjectSm3.Service
{
    public interface IFeedbackService
    {
        Task<Feedback> CreateFeedbackAsync(FeedbackRequest request);
        Task<IEnumerable<FeedbackResponse>> GetAllFeedbacksAsync();
        Task<bool> DeleteFeedbackAsync(int id);
    }
}