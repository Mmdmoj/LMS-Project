using Lms_Online.Models;
using Microsoft.EntityFrameworkCore;
using Lms_Online.Data;
using Lms_Online.Repository;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lms_Online.Service
{
    public class CourseService : ICourseService
    {
        private readonly LmsDbContext _context;
        private readonly IRoleResourceActionService _roleResourceActionService;

        public CourseService(LmsDbContext context, IRoleResourceActionService roleResourceActionService)
        {
            _context = context;
            _roleResourceActionService = roleResourceActionService;
        }

        private async Task<bool> CheckPermission(int userId, string resource, string action) =>
            await _roleResourceActionService.HasPermission(userId, resource, action);

        public async Task<bool> CreateCourseAsync(Course course, int userId)
        {
            if(!await CheckPermission(userId, "Course", "Create"))
                return false;

            course.InstructorId = userId;
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Course>> GetAllCoursesAsync(int userId)
        {
            if(!await CheckPermission(userId, "Course", "View"))
                return new List<Course>(); // Return an empty list for unauthorized view

            return await _context.Courses
                .AsNoTracking()
                .Where(c =>  c.InstructorId == userId) // Show only published courses or those created by the instructor
                .Include(c=>c.Instructor)
                .ToListAsync();
        }

        public async Task<Course> GetCourseByIdAsync(int courseId, int userId)
        {
            if(!await CheckPermission(userId, "Course", "View"))
                return null;

            var course = await _context.Courses
                .AsNoTracking()
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.CourseId == courseId);

            // Check if the course is published or the user is the instructor
            if(course == null || (!course.IsPublished && course.InstructorId != userId))
                return null;

            return course;
        }

        public async Task<bool> UpdateCourseAsync(Course course, int userId)
        {
            if(!await CheckPermission(userId, "Course", "Update"))
                return false;

            // Ensure the course exists and load its current data
            var existingCourse = await _context.Courses.Include(c => c.Instructor)
                                                       .FirstOrDefaultAsync(c => c.CourseId == course.CourseId);

            if(existingCourse == null || existingCourse.InstructorId != userId)
                return false;  // Course not found or user is not the instructor

            // Update fields as needed (Instructor remains the same)
            existingCourse.CourseName = course.CourseName;
            existingCourse.Description = course.Description;
            existingCourse.Duration = course.Duration;
            existingCourse.Category = course.Category;
            existingCourse.IsPublished = course.IsPublished;

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> PublishCourseAsync(int courseId, bool isPublished, int userId)
        {
            if(!await CheckPermission(userId, "Course", "Update"))
                return false;

            var course = await _context.Courses.FindAsync(courseId);
            if(course == null || course.InstructorId != userId)
                return false;

            course.IsPublished = isPublished;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCourseAsync(int courseId, int userId)
        {
            if(!await CheckPermission(userId, "Course", "Delete"))
                return false;

            var course = await _context.Courses.FindAsync(courseId);
            if(course == null || course.InstructorId != userId)
                return false;

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
