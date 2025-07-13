using Lms_Online.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Lms_Online.Repository;
using System.Threading.Tasks;
using Lms_Online.Service;

namespace Lms_Online.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateQuiz([FromBody] QuizDto quizDto)
        {
            if(!ModelState.IsValid)
                return BadRequest("Invalid quiz data.");

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var quiz = await _quizService.CreateQuizAsync(quizDto, userId);

            if(quiz == null)
                return Forbid("Creation failed: You may not have permission.");

            return Ok(new { message = "Quiz created successfully.", quiz });
        }

        [HttpGet("{quizId}")]
        public async Task<IActionResult> GetQuiz(int quizId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var quiz = await _quizService.GetQuizByIdAsync(quizId, userId);

            if(quiz == null)
                return NotFound("Quiz not found or you may not have permission.");

            return Ok(quiz);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllQuiz()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var quizzes = await _quizService.GetQuizAsync(userId);

            if(quizzes == null)
                return NotFound("Assignment not found or you may not have permission.");
            return Ok(quizzes);
        }

        [HttpPut("update/{quizId}")]
        public async Task<IActionResult> UpdateQuiz(int quizId, [FromBody] QuizDto quizDto)
        {
            if(!ModelState.IsValid)
                return BadRequest("Invalid quiz data.");

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _quizService.UpdateQuizAsync(quizId, quizDto, userId);

            if(!result)
                return Forbid("Update failed: You may not have permission or quiz does not exist.");

            return Ok(new { message = "Quiz updated successfully." });
        }

        [HttpDelete("delete/{quizId}")]
        public async Task<IActionResult> DeleteQuiz(int quizId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _quizService.DeleteQuizAsync(quizId, userId);

            if(!result)
                return Forbid("Delete failed: You may not have permission or quiz does not exist.");

            return Ok(new { message = "Quiz deleted successfully." });
        }
    }
}
