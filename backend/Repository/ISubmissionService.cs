using Lms_Online.DTO;
using Lms_Online.Models;

namespace Lms_Online.Repository
{
    public interface ISubmissionService
    {
        Task<Submission> CreateSubmissionAsync(SubmissionDto submissionDto, int userId);
        Task<Submission> GetSubmissionByIdAsync(int submissionId, int userId);
        Task<bool> UpdateSubmissionAsync(int submissionId, SubmissionDto submissionDto, int userId);
        Task<bool> DeleteSubmissionAsync(int submissionId, int userId);
        Task<bool> UpdateGradeAsync(int submissionId, decimal grade, int instructorId);
    }
}
