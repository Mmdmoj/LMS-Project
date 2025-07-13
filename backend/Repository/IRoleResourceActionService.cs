using Lms_Online.Models;

namespace Lms_Online.Repository
{
    public interface IRoleResourceActionService
    {
        Task<List<RoleResourceAction>> GetPermissionsForRole(int roleId);
        Task<bool> HasPermission(int userId, string resourceName, string actionName);
        //Task<List<string>> GetAccessLevel(int userId, string resourceName);
    }
}
