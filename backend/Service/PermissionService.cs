using Lms_Online.Data;
using Lms_Online.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Lms_Online.Service
{
    public class PermissionService
    {
        private readonly LmsDbContext _context;

        public PermissionService(LmsDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserPermission>> GetUserPermissionsAsync(int userId, int? resourceId = null)
        {
            var userIdParam = new SqlParameter("@UserID", userId);
            var resourceIdParam = new SqlParameter("@ResourceID", resourceId ?? (object)DBNull.Value);

            return await _context.Permissions
                .FromSqlRaw("SELECT * FROM dbo.getUserPermissions(@UserID, @ResourceID)", userIdParam, resourceIdParam)
                .ToListAsync();
        }
    }
}
