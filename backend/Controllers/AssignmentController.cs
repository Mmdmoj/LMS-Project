using Lms_Online.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Lms_Online.Repository;

namespace Lms_Online.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AssignmentController : ControllerBase
    {
        private readonly IAssignmentService _assignmentService;

        public AssignmentController(IAssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAssignment([FromBody] AssignmentDto assignmentDto)
        {
            if(!ModelState.IsValid)
                return BadRequest("Invalid assignment data.");

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var assignment = await _assignmentService.CreateAssignmentAsync(assignmentDto, userId);

            if(assignment == null)
                return Forbid("Creation failed: You may not have permission.");

            return Ok(new { message = "Assignment created successfully.", assignment });
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllAssignments()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var assignments = await _assignmentService.GetAllAssignmentsAsync(userId);

            if(assignments == null || !assignments.Any())
                return NotFound("No assignments found or you may not have permission.");

            return Ok(assignments);
        }

        [HttpGet("{assignmentId}")]
        public async Task<IActionResult> GetAssignment(int assignmentId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var assignment = await _assignmentService.GetAssignmentByIdAsync(assignmentId, userId);

            if(assignment == null)
                return NotFound("Assignment not found or you may not have permission.");

            return Ok(assignment);
        }

        [HttpPut("update/{assignmentId}")]
        public async Task<IActionResult> UpdateAssignment(int assignmentId, [FromBody] AssignmentDto assignmentDto)
        {
            if(!ModelState.IsValid)
                return BadRequest("Invalid assignment data.");

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _assignmentService.UpdateAssignmentAsync(assignmentId, assignmentDto, userId);

            if(!result)
                return Forbid("Update failed: You may not have permission or assignment does not exist.");

            return Ok(new { message = "Assignment updated successfully." });
        }

        [HttpDelete("delete/{assignmentId}")]
        public async Task<IActionResult> DeleteAssignment(int assignmentId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _assignmentService.DeleteAssignmentAsync(assignmentId, userId);

            if(!result)
                return Forbid("Delete failed: You may not have permission or assignment does not exist.");

            return Ok(new { message = "Assignment deleted successfully." });
        }
    }
}
