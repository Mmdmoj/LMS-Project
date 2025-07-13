using Lms_Online.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lms_Online.Repository
{
    public interface IEnrollmentService
    {
        Task<bool> EnrollInCourseAsync(int courseId, int userId);
        Task<List<Enrollment>> GetUserEnrollmentsAsync(int userId);
        Task<bool> UnenrollFromCourseAsync(int courseId, int userId);
    }
}
