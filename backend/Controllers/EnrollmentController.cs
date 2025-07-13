using Lms_Online.DTO;
using Lms_Online.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Lms_Online.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }


        
        [HttpPost("enroll")]
        public async Task<IActionResult> EnrollInCourse([FromBody] EnrollmentDto enrollmentDto)
        {
            if(!ModelState.IsValid)
                return BadRequest("Invalid enrollment data.");

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _enrollmentService.EnrollInCourseAsync(enrollmentDto.CourseId, userId);

            if(!result)
                return Forbid("Enrollment failed: You may not have permission, or the course may not be available.");

            return Ok(new { message = "Enrollment successful." });
        }

        [HttpGet("my-enrollments")]
        public async Task<IActionResult> GetUserEnrollments()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var enrollments = await _enrollmentService.GetUserEnrollmentsAsync(userId);
            if(enrollments == null || !enrollments.Any())
                return NotFound("No enrollments found for this user.");

            return Ok(enrollments);
        }

        [HttpDelete("unenroll/{courseId}")]
        public async Task<IActionResult> UnenrollFromCourse(int courseId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var result = await _enrollmentService.UnenrollFromCourseAsync(courseId, userId);
            if(!result)
                return Forbid("Unenrollment failed: You may not have permission, or you’re not enrolled in this course.");

            return Ok(new { message = "Successfully unenrolled from the course." });
        }
    }
}
