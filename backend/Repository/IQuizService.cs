using Lms_Online.DTO;

namespace Lms_Online.Repository
{
    public interface IQuizService
    {
        Task<List<Quiz>> GetQuizAsync(int userId);
        Task<Quiz> CreateQuizAsync(QuizDto quizDto, int userId);
        Task<Quiz> GetQuizByIdAsync(int quizId, int userId);
        Task<bool> UpdateQuizAsync(int quizId, QuizDto quizDto, int userId);
        Task<bool> DeleteQuizAsync(int quizId, int userId);
    }
}
