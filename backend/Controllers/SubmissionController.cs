using Lms_Online.Models;
using Lms_Online.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubmissionController : ControllerBase
{
    private readonly ISubmissionService _submissionService;

    public SubmissionController(ISubmissionService submissionService)
    {
        _submissionService = submissionService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateSubmission([FromBody] SubmissionDto submissionDto)
    {
        if(!ModelState.IsValid)
            return BadRequest("Invalid submission data.");

        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        try
        {
            var submission = await _submissionService.CreateSubmissionAsync(submissionDto, userId);

            if(submission == null)
                return Forbid("Creation failed: You may not have permission, or the assignment/enrollment doesn't exist.");

            return Ok(new { message = "Submission created successfully.", submission });
        }
        catch(Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{submissionId}")]
    public async Task<IActionResult> GetSubmission(int submissionId)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var submission = await _submissionService.GetSubmissionByIdAsync(submissionId, userId);

        if(submission == null)
            return NotFound("Submission not found or you do not have permission to view it.");

        return Ok(submission);
    }


    [HttpPut("update/{submissionId}")]
    public async Task<IActionResult> UpdateSubmission(int submissionId, [FromBody] SubmissionDto submissionDto)
    {
        if(!ModelState.IsValid)
            return BadRequest("Invalid submission data.");

        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var result = await _submissionService.UpdateSubmissionAsync(submissionId, submissionDto, userId);

        if(!result)
            return Forbid("Update failed: You may not have permission, or submission does not exist.");

        return Ok(new { message = "Submission updated successfully." });
    }


    [HttpPut("grade/{submissionId}")]
    [Authorize(Roles = "Instructor")] // Restrict to instructors
    public async Task<IActionResult> UpdateGrade(int submissionId, [FromBody] decimal grade)
    {
        int instructorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var result = await _submissionService.UpdateGradeAsync(submissionId, grade, instructorId);

        if(!result)
            return Forbid("Grading failed: You may not have permission, or the submission does not exist.");

        return Ok(new { message = "Grade updated successfully." });
    }

    [HttpDelete("delete/{submissionId}")]
    public async Task<IActionResult> DeleteSubmission(int submissionId)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var result = await _submissionService.DeleteSubmissionAsync(submissionId, userId);

        if(!result)
            return Forbid("Delete failed: You may not have permission, or submission does not exist.");

        return Ok(new { message = "Submission deleted successfully." });
    }
}
