using Lms_Online.Models;

namespace Lms_Online.Repository
{
    public interface ICoursePresentService
    {
        Task<CoursePresent> CreateCoursePresentAsync(int courseId, DateTime startDate, DateTime? endDate, int? maxEnrollments, bool progressTrackingEnabled, int userId);
        Task<CoursePresent> GetCoursePresentByIdAsync(int coursePresentId, int userId);
        Task<bool> UpdateCoursePresentAsync(int coursePresentId, DateTime startDate, DateTime? endDate, int? maxEnrollments, bool progressTrackingEnabled, int userId);
        Task<bool> DeleteCoursePresentAsync(int coursePresentId, int userId);
        Task<IEnumerable<CoursePresent>> GetAllCoursePresentsAsync(int userId);
    }
}
