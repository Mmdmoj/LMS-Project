using Lms_Online.Data;
using Lms_Online.DTO;
using Lms_Online.Models;
using Lms_Online.Repository;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Lms_Online.Service
{
    public class QuizService : IQuizService
    {
        private readonly LmsDbContext _context;
        private readonly IRoleResourceActionService _roleResourceActionService;

        public QuizService(LmsDbContext context, IRoleResourceActionService roleResourceActionService)
        {
            _context = context;
            _roleResourceActionService = roleResourceActionService;
        }

        private async Task<bool> CheckPermission(int userId, string resource, string action) =>
            await _roleResourceActionService.HasPermission(userId, resource, action);

        public async Task<Quiz> CreateQuizAsync(QuizDto quizDto, int userId)
        {
            if(!await CheckPermission(userId, "Quiz", "Create"))
                return null;

            var quiz = new Quiz
            {
                CoursePresentId = quizDto.CoursePresentId,
                QuizTitle = quizDto.QuizTitle,
                QuizDescription = quizDto.QuizDescription,
                DueDate = quizDto.DueDate,
                MaxScore = quizDto.MaxScore
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return quiz;
        }

        public async Task<List<Quiz>> GetQuizAsync(int userId)
        {
            if(!await CheckPermission(userId, "Quiz", "View"))
                return null;

            return await _context.Quizzes
                .Include(q => q.CoursePresent)
                .ToListAsync();

        }

        public async Task<Quiz> GetQuizByIdAsync(int quizId, int userId)
        {
            if(!await CheckPermission(userId, "Quiz", "View"))
                return null;

            return await _context.Quizzes
                .Include(q => q.CoursePresent)
                .FirstOrDefaultAsync(q => q.QuizId == quizId);
        }

        public async Task<bool> UpdateQuizAsync(int quizId, QuizDto quizDto, int userId)
        {
            if(!await CheckPermission(userId, "Quiz", "Update"))
                return false;

            var quiz = await _context.Quizzes.FindAsync(quizId);
            if(quiz == null)
                return false;

            quiz.QuizTitle = quizDto.QuizTitle;
            quiz.QuizDescription = quizDto.QuizDescription;
            quiz.DueDate = quizDto.DueDate;
            quiz.MaxScore = quizDto.MaxScore;

            _context.Quizzes.Update(quiz);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteQuizAsync(int quizId, int userId)
        {
            if(!await CheckPermission(userId, "Quiz", "Delete"))
                return false;

            var quiz = await _context.Quizzes.FindAsync(quizId);
            if(quiz == null)
                return false;

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
