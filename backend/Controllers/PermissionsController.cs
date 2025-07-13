using System.Security.Claims;
using Lms_Online.Service;
using Microsoft.AspNetCore.Mvc;

namespace Lms_Online.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermissionsController : ControllerBase
    {
        private readonly PermissionService _permissionService;

        public PermissionsController(PermissionService permissionService)
        {
            _permissionService = permissionService;
        }

        [HttpGet("{resourceId?}")]
        public async Task<IActionResult> GetUserPermissions(int? resourceId = null)
        {
            try
            {
                // Extract the User ID from the JWT claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if(userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token.");
                }

                int userId = int.Parse(userIdClaim.Value);

                var permissions = await _permissionService.GetUserPermissionsAsync(userId, resourceId);

                if(!permissions.Any())
                    return NotFound("No permissions found for the given user and resource.");

                return Ok(permissions);
            }
            catch(Exception ex)
            {
                // Log exception here
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
