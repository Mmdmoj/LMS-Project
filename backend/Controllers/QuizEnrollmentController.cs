using Lms_Online.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Lms_Online.Service;
using System.Threading.Tasks;
using Lms_Online.Repository;

namespace Lms_Online.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuizEnrollmentController : ControllerBase
    {
        private readonly IQuizEnrollmentService _quizEnrollmentService;

        public QuizEnrollmentController(IQuizEnrollmentService quizEnrollmentService)
        {
            _quizEnrollmentService = quizEnrollmentService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateQuizEnrollment([FromBody] QuizEnrollmentDto dto)
        {
            if(!ModelState.IsValid)
                return BadRequest("Invalid enrollment data.");

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _quizEnrollmentService.CreateQuizEnrollmentAsync(dto, userId);

            return result == null
                ? Forbid("Creation failed: You may not have permission or data is invalid.")
                : Ok(new { message = "Enrollment created successfully.", result });
        }

        [HttpGet("{quizId}/{enrollmentId}")]
        public async Task<IActionResult> GetQuizEnrollment(int quizId, int enrollmentId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var quizEnrollment = await _quizEnrollmentService.GetQuizEnrollmentAsync(quizId, enrollmentId, userId);

            return quizEnrollment == null
                ? NotFound("Enrollment not found or you do not have permission to view this enrollment.")
                : Ok(quizEnrollment);
        }


        [HttpPut("update/{quizId}/{enrollmentId}")]
        public async Task<IActionResult> UpdateQuizEnrollment(int quizId, int enrollmentId, [FromBody] QuizEnrollmentDto dto)
        {
            if(!ModelState.IsValid)
                return BadRequest("Invalid enrollment data.");

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _quizEnrollmentService.UpdateQuizEnrollmentAsync(quizId, enrollmentId, dto, userId);

            return !result
                ? Forbid("Update failed: You may not have permission or enrollment does not exist.")
                : Ok(new { message = "Enrollment updated successfully." });
        }

        [HttpDelete("delete/{quizId}/{enrollmentId}")]
        public async Task<IActionResult> DeleteQuizEnrollment(int quizId, int enrollmentId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _quizEnrollmentService.DeleteQuizEnrollmentAsync(quizId, enrollmentId, userId);

            return !result
                ? Forbid("Delete failed: You may not have permission or enrollment does not exist.")
                : Ok(new { message = "Enrollment deleted successfully." });
        }
    }

}
