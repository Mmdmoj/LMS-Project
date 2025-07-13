using Lms_Online.Models;

namespace Lms_Online.Service
{
    public interface IContentService
    {
        Task<bool> AddContentAsync(Content content, int userId);
        Task<List<Content>> GetAllContentByCoursePresentIdAsync(int coursePresentId, int userId);
        Task<Content> GetContentByIdAsync(int contentId, int userId);
        Task<bool> UpdateContentAsync(Content content, int coursePresentId, int userId);
        Task<bool> DeleteContentAsync(int contentId, int userId);
    }
}
