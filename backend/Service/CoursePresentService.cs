using Lms_Online.Data;
using Lms_Online.Models;
using Lms_Online.Repository;
using Microsoft.EntityFrameworkCore;

namespace Lms_Online.Service
{
    public class CoursePresentService : ICoursePresentService
    {
        private readonly LmsDbContext _context;
        private readonly IRoleResourceActionService _roleResourceActionService;

        public CoursePresentService(LmsDbContext context, IRoleResourceActionService roleResourceActionService)
        {
            _context = context;
            _roleResourceActionService = roleResourceActionService;
        }

        private async Task<bool> CheckPermission(int userId, string resource, string action) =>
            await _roleResourceActionService.HasPermission(userId, resource, action);

        public async Task<CoursePresent> CreateCoursePresentAsync(int courseId, DateTime startDate, DateTime? endDate, int? maxEnrollments, bool progressTrackingEnabled, int userId)
        {
            if(!await CheckPermission(userId, "CoursePresent", "Create"))
                return null;

            var coursePresent = new CoursePresent
            {
                CourseId = courseId,
                StartDate = startDate,
                EndDate = endDate,
                MaxEnrollments = maxEnrollments,
                ProgressTrackingEnabled = progressTrackingEnabled
            };

            _context.CoursePresents.Add(coursePresent);
            await _context.SaveChangesAsync();

            return coursePresent;
        }

        public async Task<CoursePresent> GetCoursePresentByIdAsync(int coursePresentId, int userId)
        {
            if(!await CheckPermission(userId, "CoursePresent", "View"))
                return null;

            return await _context.CoursePresents
                .Include(cp => cp.Course)
                .FirstOrDefaultAsync(cp => cp.CoursePresentId == coursePresentId);
        }

        public async Task<bool> UpdateCoursePresentAsync(int coursePresentId, DateTime startDate, DateTime? endDate, int? maxEnrollments, bool progressTrackingEnabled, int userId)
        {
            if(!await CheckPermission(userId, "CoursePresent", "Update"))
                return false;

            var coursePresent = await _context.CoursePresents.FindAsync(coursePresentId);
            if(coursePresent == null)
                return false;

            coursePresent.StartDate = startDate;
            coursePresent.EndDate = endDate;
            coursePresent.MaxEnrollments = maxEnrollments;
            coursePresent.ProgressTrackingEnabled = progressTrackingEnabled;

            _context.CoursePresents.Update(coursePresent);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteCoursePresentAsync(int coursePresentId, int userId)
        {
            if(!await CheckPermission(userId, "CoursePresent", "Delete"))
                return false;

            var coursePresent = await _context.CoursePresents.FindAsync(coursePresentId);
            if(coursePresent == null)
                return false;

            _context.CoursePresents.Remove(coursePresent);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<IEnumerable<CoursePresent>> GetAllCoursePresentsAsync(int userId)
        {
            // Check if the user has "View" permission for CoursePresent resource.
            if(!await CheckPermission(userId, "CoursePresent", "View"))
                return Enumerable.Empty<CoursePresent>();

            return await _context.CoursePresents
                .Include(cp => cp.Course)
                .ToListAsync();
        }
    }
}
