using System;
using System.Threading.Tasks;
using Lms_Online.DTO;
using Lms_Online.Models;
using Lms_Online.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Lms_Online.Repository;

namespace Lms_Online.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CoursePresentController : ControllerBase
    {
        private readonly ICoursePresentService _coursePresentService;

        public CoursePresentController(ICoursePresentService coursePresentService)
        {
            _coursePresentService = coursePresentService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCoursePresent([FromBody] CoursePresentDto coursePresentDto)
        {
            if(!ModelState.IsValid)
                return BadRequest("Invalid course presentation data.");

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var coursePresent = await _coursePresentService.CreateCoursePresentAsync(
                coursePresentDto.CourseId,
                coursePresentDto.StartDate,
                coursePresentDto.EndDate,
                coursePresentDto.MaxEnrollments,
                coursePresentDto.ProgressTrackingEnabled,
                userId
            );

            if(coursePresent == null)
                return Forbid("Creation failed: You may not have permission.");

            return Ok(new { message = "Course presentation created successfully.", coursePresent });
        }

        [HttpGet("{coursePresentId}")]
        public async Task<IActionResult> GetCoursePresent(int coursePresentId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var coursePresent = await _coursePresentService.GetCoursePresentByIdAsync(coursePresentId, userId);

            if(coursePresent == null)
                return NotFound("Course presentation not found or you may not have permission.");

            return Ok(coursePresent);
        }

        [HttpPut("update/{coursePresentId}")]
        public async Task<IActionResult> UpdateCoursePresent(int coursePresentId, [FromBody] CoursePresentDto coursePresentDto)
        {
            if(!ModelState.IsValid)
                return BadRequest("Invalid course presentation data.");

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _coursePresentService.UpdateCoursePresentAsync(
                coursePresentId,
                coursePresentDto.StartDate,
                coursePresentDto.EndDate,
                coursePresentDto.MaxEnrollments,
                coursePresentDto.ProgressTrackingEnabled,
                userId
            );

            if(!result)
                return Forbid("Update failed: You may not have permission or course presentation does not exist.");

            return Ok(new { message = "Course presentation updated successfully." });
        }

        [HttpDelete("delete/{coursePresentId}")]
        public async Task<IActionResult> DeleteCoursePresent(int coursePresentId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _coursePresentService.DeleteCoursePresentAsync(coursePresentId, userId);

            if(!result)
                return Forbid("Delete failed: You may not have permission or course presentation does not exist.");

            return Ok(new { message = "Course presentation deleted successfully." });
        }

        [HttpGet("view")]
        public async Task<IActionResult> GetAllCoursePresents()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var coursePresents = await _coursePresentService.GetAllCoursePresentsAsync(userId);

            if(coursePresents == null || !coursePresents.Any())
                return NotFound("No course presentations found or you may not have permission to view them.");

            return Ok(coursePresents);
        }

    }
}
