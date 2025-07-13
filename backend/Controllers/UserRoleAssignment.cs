using Lms_Online.Models;
using Lms_Online.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Lms_Online.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleAssignmentController : ControllerBase
    {
        private readonly IUserRoleAssignmentService _userRoleAssignmentService;

        public UserRoleAssignmentController(IUserRoleAssignmentService userRoleAssignmentService)
        {
            _userRoleAssignmentService = userRoleAssignmentService;
        }


        [HttpPost("AssignRoleToUser")]
        public async Task<IActionResult> AssignRoleToUser(int userId, int roleId)
        {
            var result = await _userRoleAssignmentService.AssignRoleToUser(userId, roleId);
            if(result)
            {
                return Ok("Role assigned to user successfully.");
            }
            return BadRequest("Failed to assign role to user.");
        }


        [HttpGet("GetUserRoles")]
        public async Task<ActionResult<List<UserRoleAssignment>>> GetUserRoles()
        {
            // Extract the logged-in user's ID from JWT claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if(string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("User ID not found in token.");
            }

            var roles = await _userRoleAssignmentService.GetUserRoles(userId);

            if(roles == null || roles.Count == 0)
            {
                return NotFound("No roles found for the current user.");
            }

            return Ok(roles);
        }


        [HttpDelete("RemoveRoleFromUser")]
        public async Task<IActionResult> RemoveRoleFromUser(int userId, int roleId)
        {
            var result = await _userRoleAssignmentService.RemoveRoleFromUser(userId, roleId);
            if(result)
            {
                return Ok("Role removed from user successfully.");
            }
            return BadRequest("Failed to remove role from user.");
        }
    }
}
