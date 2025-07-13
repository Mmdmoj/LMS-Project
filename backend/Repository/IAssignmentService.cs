using Lms_Online.DTO;
using Lms_Online.Models;

namespace Lms_Online.Repository
{
    public interface IAssignmentService
    {
        Task<List<Assignment>> GetAllAssignmentsAsync(int userId);
        Task<Assignment> CreateAssignmentAsync(AssignmentDto assignmentDto, int userId);
        Task<Assignment> GetAssignmentByIdAsync(int assignmentId, int userId);
        Task<bool> UpdateAssignmentAsync(int assignmentId, AssignmentDto assignmentDto, int userId);
        Task<bool> DeleteAssignmentAsync(int assignmentId, int userId);
    }
}
