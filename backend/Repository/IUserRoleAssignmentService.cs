using Lms_Online.Models;

namespace Lms_Online.Repository
{
    public interface IUserRoleAssignmentService
    {
        Task<bool> AssignRoleToUser(int userId, int roleId);
        Task<List<UserRoleAssignment>> GetUserRoles(int userId);
        Task<bool> RemoveRoleFromUser(int userId, int roleId);
    }
}
