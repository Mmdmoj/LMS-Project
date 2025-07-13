using Lms_Online.Data;
using Lms_Online.Models;
using Lms_Online.Repository;
using Microsoft.EntityFrameworkCore;

namespace Lms_Online.Service
{
    public class RoleResourceActionService : IRoleResourceActionService
    {
        private readonly LmsDbContext _context;

        public RoleResourceActionService(LmsDbContext context)
        {
            _context = context;
        }

        public async Task<List<RoleResourceAction>> GetPermissionsForRole(int roleId)
        {
            return await _context.RoleResourceActions
                .Include(rra => rra.Resource)
                .Include(rra => rra.Action)
                .Where(rra => rra.RoleId == roleId)
                .ToListAsync();
        }

        public async Task<bool> HasPermission(int userId, string resourceName, string actionName)
        {
            // Get the user's role
            var roleId = await GetUserRoleId(userId);
            if(roleId == null)
                return false;

            // Get the resource and action from the database
            var resource = await _context.Resources.FirstOrDefaultAsync(r => r.ResourceName == resourceName);
            var action = await _context.Actions.FirstOrDefaultAsync(a => a.ActionName == actionName);

            if(resource == null || action == null)
                return false;

            // Check if the user's role has the required permission
            return await _context.RoleResourceActions.AnyAsync(rra =>
                rra.RoleId == roleId &&
                rra.ResourceId == resource.ResourceId &&
                rra.ActionId == action.ActionId);
        }

        private async Task<int?> GetUserRoleId(int userId)
        {
            var userRole = await _context.UserRoleAssignments
                .FirstOrDefaultAsync(ura => ura.UserId == userId);
            return userRole?.RoleId;
        }
       //public async Task<List<string>> GetAccessLevel(int userId, string resourceName)
       // {
       //     // Get the user's role
       //     var roleId = await GetUserRoleId(userId);
       //     if(roleId == null)
       //         throw new Exception("User role not found.");

       //     // Get the resource
       //     var resource = await _context.Resources.FirstOrDefaultAsync(r => r.ResourceName == resourceName);
       //     if(resource == null)
       //         throw new Exception("Resource not found.");

       //     // Get the list of actions allowed for the user's role on the resource
       //     var actions = await _context.RoleResourceActions
       //         .Where(rra => rra.RoleId == roleId && rra.ResourceId == resource.ResourceId)
       //         .Select(rra => rra.Action.ActionName) // Fetch only Action names
       //         .ToListAsync();

       //     return actions;
       // }

    }
}
