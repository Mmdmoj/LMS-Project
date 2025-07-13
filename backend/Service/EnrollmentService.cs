using Lms_Online.Models;
using Microsoft.EntityFrameworkCore;
using Lms_Online.Data;
using Lms_Online.Repository;

namespace Lms_Online.Service
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly LmsDbContext _context;
        private readonly IRoleResourceActionService _roleResourceActionService;

        public EnrollmentService(LmsDbContext context, IRoleResourceActionService roleResourceActionService)
        {
            _context = context;
            _roleResourceActionService = roleResourceActionService;
        }

        private async Task<bool> CheckPermission(int userId, string resource, string action) =>
            await _roleResourceActionService.HasPermission(userId, resource, action);

        public async Task<bool> EnrollInCourseAsync(int coursePresentId, int userId)
        {
            try
            {
                if(!await CheckPermission(userId, "Enrollment", "Create"))
                {
                    Console.WriteLine("Permission denied for enrollment creation.");
                    return false;
                }

                var coursePresent = await _context.CoursePresents
                    .Include(cp => cp.Course)
                    .FirstOrDefaultAsync(cp => cp.CoursePresentId == coursePresentId);

                if(coursePresent == null ||
                    (coursePresent.MaxEnrollments.HasValue && coursePresent.CurrentEnrollments >= coursePresent.MaxEnrollments))
                {
                    Console.WriteLine("Enrollment conditions not met.");
                    return false;
                }

                var existingEnrollment = await _context.Enrollments
                    .FirstOrDefaultAsync(e => e.CoursePresentId == coursePresentId && e.StudentId == userId);

                if(existingEnrollment != null)
                {
                    Console.WriteLine("User is already enrolled.");
                    return false;
                }

                var enrollment = new Enrollment
                {
                    CoursePresentId = coursePresentId,
                    StudentId = userId,
                    Status = "Active",
                    Progress = 0.00M,
                    EnrollmentDate = DateTime.UtcNow
                };

                _context.Enrollments.Add(enrollment);
                coursePresent.CurrentEnrollments++;
                _context.CoursePresents.Update(coursePresent);

                await _context.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return false;
            }
        }

        public async Task<List<Enrollment>> GetUserEnrollmentsAsync(int userId)
        {
            if(!await CheckPermission(userId, "Enrollment", "View"))
                return null;

            return await _context.Enrollments
                 .Include(e => e.CoursePresent)                // Include CoursePresent
                      .ThenInclude(cp => cp.Course)            // Include the Course within CoursePresent
                 .Include(e => e.Student)                     // Optionally include Student if needed
                 .Where(e => e.StudentId == userId)
                 .AsNoTracking()
                 .ToListAsync();
        }

        public async Task<bool> UnenrollFromCourseAsync(int coursePresentId, int userId)
        {
            if(!await CheckPermission(userId, "Enrollment", "Delete"))
                return false;

            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.CoursePresentId == coursePresentId && e.StudentId == userId);

            if(enrollment == null)
                return false;

            _context.Enrollments.Remove(enrollment);

            // Decrement the current enrollments count
            var coursePresent = await _context.CoursePresents.FindAsync(coursePresentId);
            if(coursePresent != null && coursePresent.CurrentEnrollments > 0)
            {
                coursePresent.CurrentEnrollments--;
                _context.CoursePresents.Update(coursePresent);
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
