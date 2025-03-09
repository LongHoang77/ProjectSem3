using System.Threading.Tasks;
using ProjectSm3.Entity;

namespace ProjectSm3.Repositories.Interface
{
    public interface IFeedbackRepository
    {
        Task<Feedback> CreateFeedbackAsync(Feedback feedback);
    }
}