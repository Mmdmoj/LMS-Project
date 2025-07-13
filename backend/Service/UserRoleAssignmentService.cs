using Lms_Online.Data;
using Lms_Online.Models;
using Lms_Online.Repository;
using Microsoft.EntityFrameworkCore;

namespace Lms_Online.Service
{
    public class UserRoleAssignmentService : IUserRoleAssignmentService
    {
        private readonly LmsDbContext _context;

        public UserRoleAssignmentService(LmsDbContext context)
        {
            _context = context;
        }

        // Assign a role to a user
        public async Task<bool> AssignRoleToUser(int userId, int roleId)
        {
            var userRoleAssignment = new UserRoleAssignment
            {
                UserId = userId,
                RoleId = roleId
            };

            _context.UserRoleAssignments.Add(userRoleAssignment);
            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<List<UserRoleAssignment>> GetUserRoles(int userId)
        {
            return await _context.UserRoleAssignments
                .Where(ura => ura.UserId == userId)
                .ToListAsync();
        }


        public async Task<bool> RemoveRoleFromUser(int userId, int roleId)
        {
            var userRoleAssignment = await _context.UserRoleAssignments
                .FirstOrDefaultAsync(ura => ura.UserId == userId && ura.RoleId == roleId);

            if(userRoleAssignment == null)
            {
                return false; // Assignment not found
            }

            _context.UserRoleAssignments.Remove(userRoleAssignment);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
