using Lms_Online.DTO;
using Lms_Online.Models;

namespace Lms_Online.Repository
{
    public interface IQuizEnrollmentService
    {
        Task<QuizEnrollment> CreateQuizEnrollmentAsync(QuizEnrollmentDto dto, int userId);
        Task<QuizEnrollment> GetQuizEnrollmentAsync(int quizId, int enrollmentId, int userId);
        Task<bool> UpdateQuizEnrollmentAsync(int quizId, int enrollmentId, QuizEnrollmentDto dto, int userId);
        Task<bool> DeleteQuizEnrollmentAsync(int quizId, int enrollmentId, int userId);

    }
}
