using Lms_Online.Data;
using Lms_Online.DTO;
using Lms_Online.Models;
using Lms_Online.Repository;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Lms_Online.Service
{
    public class QuizEnrollmentService : IQuizEnrollmentService
    {
        private readonly LmsDbContext _context;
        private readonly IRoleResourceActionService _roleResourceActionService;

        public QuizEnrollmentService(LmsDbContext context, IRoleResourceActionService roleResourceActionService)
        {
            _context = context;
            _roleResourceActionService = roleResourceActionService;
        }

        private async Task<bool> CheckPermission(int userId, string resource, string action) =>
            await _roleResourceActionService.HasPermission(userId, resource, action);

        public async Task<QuizEnrollment> CreateQuizEnrollmentAsync(QuizEnrollmentDto dto, int userId)
        {
            if(!await CheckPermission(userId, "QuizEnrollment", "Create"))
                return null;

            // Ensure Enrollment exists before proceeding
            var enrollmentExists = await _context.Enrollments.AnyAsync(e => e.EnrollmentId == dto.EnrollmentId);
            if(!enrollmentExists)
                return null;

            var quizEnrollment = new QuizEnrollment
            {
                QuizId = dto.QuizId,
                EnrollmentId = dto.EnrollmentId,
                Score = dto.Score
            };

            _context.quizEnrollments.Add(quizEnrollment);
            await _context.SaveChangesAsync();

            return quizEnrollment;
        }

        public async Task<QuizEnrollment> GetQuizEnrollmentAsync(int quizId, int enrollmentId, int userId)
        {
            if(!await CheckPermission(userId, "QuizEnrollment", "View"))
                return null;

            // Check if the enrollment belongs to the logged-in user (student)
            var quizEnrollment = await _context.quizEnrollments
                .Include(qe => qe.Quiz)
                .Include(qe => qe.Enrollment)
                .FirstOrDefaultAsync(qe => qe.QuizId == quizId
                                            && qe.EnrollmentId == enrollmentId
                                            && qe.Enrollment.StudentId == userId); // Ensure enrollment belongs to user

            return quizEnrollment;
        }


        public async Task<bool> UpdateQuizEnrollmentAsync(int quizId, int enrollmentId, QuizEnrollmentDto dto, int userId)
        {
            if(!await CheckPermission(userId, "QuizEnrollment", "Update"))
                return false;

            var quizEnrollment = await _context.quizEnrollments
                .FirstOrDefaultAsync(qe => qe.QuizId == quizId && qe.EnrollmentId == enrollmentId);

            if(quizEnrollment == null)
                return false;

            quizEnrollment.Score = dto.Score;
            _context.quizEnrollments.Update(quizEnrollment);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteQuizEnrollmentAsync(int quizId, int enrollmentId, int userId)
        {
            if(!await CheckPermission(userId, "QuizEnrollment", "Delete"))
                return false;

            var quizEnrollment = await _context.quizEnrollments
                .FirstOrDefaultAsync(qe => qe.QuizId == quizId && qe.EnrollmentId == enrollmentId);

            if(quizEnrollment == null)
                return false;

            _context.quizEnrollments.Remove(quizEnrollment);
            await _context.SaveChangesAsync();

            return true;
        }
    }

}
