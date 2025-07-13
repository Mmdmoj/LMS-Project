using Lms_Online.Data;
using Lms_Online.DTO;
using Lms_Online.Models;
using Lms_Online.Repository;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Lms_Online.Service
{
    public class SubmissionService : ISubmissionService
    {
        private readonly LmsDbContext _context;
        private readonly IRoleResourceActionService _roleResourceActionService;

        public SubmissionService(LmsDbContext context, IRoleResourceActionService roleResourceActionService)
        {
            _context = context;
            _roleResourceActionService = roleResourceActionService;
        }

        private async Task<bool> CheckPermission(int userId, string resource, string action) =>
            await _roleResourceActionService.HasPermission(userId, resource, action);

        public async Task<Submission> CreateSubmissionAsync(SubmissionDto submissionDto, int userId)
        {
            if(!await CheckPermission(userId, "Submission", "Create"))
                return null;

            // Fetch the assignment
            var assignment = await _context.Assignments
                .FirstOrDefaultAsync(a => a.AssignmentId == submissionDto.AssignmentId);

            if(assignment == null)
                return null;

            // Fetch the enrollment for the logged-in user and the assignment's course
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentId == userId && e.CoursePresentId == assignment.CoursePresentId);

            // Handle missing enrollment
            if(enrollment == null)
            {
                throw new Exception("You are not enrolled in the course associated with this assignment.");
            }

            // Create the submission
            var submission = new Submission
            {
                AssignmentId = assignment.AssignmentId,
                EnrollmentId = enrollment.EnrollmentId,
                SubmissionDate = submissionDto.SubmissionDate,
                Grade = submissionDto.Grade,
                Feedback = submissionDto.Feedback
            };

            _context.Submissions.Add(submission);
            await _context.SaveChangesAsync();

            return submission;
        }

        public async Task<Submission> GetSubmissionByIdAsync(int submissionId, int userId)
        {
            if(!await CheckPermission(userId, "Submission", "View"))
                return null;

            // Fetch the submission ensuring the user is associated with it
            var submission = await _context.Submissions
                .Include(s => s.Assignment)
                .Include(s => s.Enrollment.CoursePresent.Course)
                .FirstOrDefaultAsync(s =>
                    s.SubmissionId == submissionId &&
                    (s.Enrollment.StudentId == userId ||
                     s.Enrollment.CoursePresent.Course.InstructorId == userId)); // Allow instructors to view

            return submission;
        }


        public async Task<bool> UpdateSubmissionAsync(int submissionId, SubmissionDto submissionDto, int userId)
        {
            if(!await CheckPermission(userId, "Submission", "Update"))
                return false;

            var submission = await _context.Submissions.FindAsync(submissionId);
            if(submission == null)
                return false;

            submission.Grade = submissionDto.Grade;
            submission.Feedback = submissionDto.Feedback;
            submission.SubmissionDate = submissionDto.SubmissionDate;

            _context.Submissions.Update(submission);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteSubmissionAsync(int submissionId, int userId)
        {
            if(!await CheckPermission(userId, "Submission", "Delete"))
                return false;

            var submission = await _context.Submissions.FindAsync(submissionId);
            if(submission == null)
                return false;

            _context.Submissions.Remove(submission);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> UpdateGradeAsync(int submissionId, decimal grade, int instructorId)
        {
            // Check that the instructor has permission to grade submissions
            if(!await CheckPermission(instructorId, "Submission", "Update"))
                return false;

            var submission = await _context.Submissions.FindAsync(submissionId);
            if(submission == null)
                return false;

            submission.Grade = grade;

            _context.Submissions.Update(submission);
            await _context.SaveChangesAsync();

            return true;
        }

    }

}
