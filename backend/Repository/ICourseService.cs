using Lms_Online.Models;

namespace Lms_Online.Repository
{
    public interface ICourseService
    {
        Task<bool> CreateCourseAsync(Course course, int userId);
        Task<Course> GetCourseByIdAsync(int courseId, int userId);
        Task<bool> UpdateCourseAsync(Course course, int userId);
        Task<bool> PublishCourseAsync(int courseId, bool isPublished, int userId);
        Task<bool> DeleteCourseAsync(int courseId, int userId);
        Task<List<Course>> GetAllCoursesAsync(int userId);


    }
}
