using Lms_Online.Models;
using Lms_Online.Repository;
using Lms_Online.Service;
using Microsoft.AspNetCore.Mvc;

namespace Lms_Online.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleResourceActionController : ControllerBase
    {
        private readonly IRoleResourceActionService _roleResourceActionService;

        public RoleResourceActionController(IRoleResourceActionService roleResourceActionService)
        {
            _roleResourceActionService = roleResourceActionService;
        }

        /// <summary>
        /// Get all permissions for a specific role.
        /// </summary>
        /// <param name="roleId">The ID of the role.</param>
        /// <returns>List of RoleResourceAction permissions.</returns>
        [HttpGet("permissions/{roleId}")]
        public async Task<IActionResult> GetPermissionsForRole(int roleId)
        {
            try
            {
                var permissions = await _roleResourceActionService.GetPermissionsForRole(roleId);
                if(permissions == null || !permissions.Any())
                {
                    return NotFound(new { Message = "No permissions found for this role." });
                }
                return Ok(permissions);
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred.", Details = ex.Message });
            }
        }

        /// <summary>
        /// Check if a user has permission to perform an action on a resource.
        /// </summary>
        /// <param name="userId">The ID of the user.</param>
        /// <param name="resourceName">The name of the resource.</param>
        /// <param name="actionName">The name of the action.</param>
        /// <returns>True if the user has permission; otherwise, false.</returns>
        [HttpGet("has-permission")]
        public async Task<IActionResult> HasPermission(int userId, string resourceName, string actionName)
        {
            try
            {
                var hasPermission = await _roleResourceActionService.HasPermission(userId, resourceName, actionName);
                return Ok(new { HasPermission = hasPermission });
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred.", Details = ex.Message });
            }
        }
    }
}
