using Lms_Online.DTO;
using Lms_Online.Models;
using Lms_Online.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Lms_Online.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCourse([FromBody] CourseCreateDto courseDto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            if(!ModelState.IsValid)
                return BadRequest("Invalid course data. Please ensure all fields are filled.");

            // Map the DTO to a Course entity
            var course = new Course
            {
                CourseName = courseDto.CourseName,
                Description = courseDto.Description,
                Duration = courseDto.Duration,
                Category = courseDto.Category,
                IsPublished = courseDto.IsPublished,
                InstructorId = userId  // Set the InstructorId directly
            };

            var result = await _courseService.CreateCourseAsync(course, userId);

            if(!result)
                return Forbid("You do not have permission to create courses.");

            return Ok(new { message = "Course created successfully." });
        }


        [HttpGet("view")]
        public async Task<IActionResult> ViewCourses()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var courses = await _courseService.GetAllCoursesAsync(userId);
            if(courses == null)
                return Forbid("You do not have permission to view courses.");

            return Ok(courses);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateCourse([FromBody] CourseUpdateDto courseDto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            if(!ModelState.IsValid || courseDto.CourseId == 0)
                return BadRequest("Invalid course data.");

            // Map the DTO to a Course entity for updating
            var course = new Course
            {
                CourseId = courseDto.CourseId,
                CourseName = courseDto.CourseName,
                Description = courseDto.Description,
                Duration = courseDto.Duration,
                Category = courseDto.Category,
                IsPublished = courseDto.IsPublished
            };

            var result = await _courseService.UpdateCourseAsync(course, userId);
            if(!result)
                return Forbid("You do not have permission to update courses.");

            return Ok(new { message = "Course updated successfully." });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var result = await _courseService.DeleteCourseAsync(id, userId);
            if(!result)
                return Forbid("You do not have permission to delete courses.");

            return Ok(new { message = "Course deleted successfully." });
        }

        [HttpPut("publish/{id}")]
        public async Task<IActionResult> PublishCourse(int id, [FromBody] bool isPublished)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var result = await _courseService.PublishCourseAsync(id, isPublished, userId);
            if(!result)
                return Forbid("You do not have permission to publish courses.");

            return Ok(new { message = isPublished ? "Course published successfully." : "Course unpublished successfully." });
        }
    }
}
