using Lms_Online.DTO;
using Lms_Online.Models;
using Lms_Online.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Lms_Online.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ContentController : ControllerBase
    {
        private readonly IContentService _contentService;

        public ContentController(IContentService contentService)
        {
            _contentService = contentService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateContent([FromBody] ContentCreateDto contentDto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var content = new Content
            {
                CoursePresentId = contentDto.CoursePresentId,
                ContentType = contentDto.ContentType,
                ContentURL = contentDto.ContentURL,
                Description = contentDto.Description
            };

            var result = await _contentService.AddContentAsync(content, userId);
            if(!result)
                return Forbid("You do not have permission to create content.");

            return Ok(new
            {
                message = "Content created successfully.",
                createdDateSolar = content.CreatedDateSolar
            });
        }

        [HttpGet("view/{coursePresentId}")]
        public async Task<IActionResult> GetAllContent(int coursePresentId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var contents = await _contentService.GetAllContentByCoursePresentIdAsync(coursePresentId, userId);
            if(contents == null)
                return Forbid("You do not have permission to view content.");

            var response = contents.Select(c => new
            {
                c.ContentId,
                c.ContentType,
                c.ContentURL,
                c.Description,
                createdDateSolar = c.CreatedDateSolar
            });

            return Ok(response);
        }

        [HttpGet("view/single/{contentId}")]
        public async Task<IActionResult> GetContentById(int contentId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var content = await _contentService.GetContentByIdAsync(contentId, userId);
            if(content == null)
                return Forbid("You do not have permission to view this content.");

            return Ok(new
            {
                content.ContentId,
                content.ContentType,
                content.ContentURL,
                content.Description,
                createdDateSolar = content.CreatedDateSolar
            });
        }

        [HttpPut("update/{coursePresentId}")]
        public async Task<IActionResult> UpdateContent(int coursePresentId, [FromBody] ContentUpdateDto contentDto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var content = new Content
            {
                ContentId = contentDto.ContentId,
                ContentType = contentDto.ContentType,
                ContentURL = contentDto.ContentURL,
                Description = contentDto.Description
            };

            var result = await _contentService.UpdateContentAsync(content, coursePresentId, userId);
            if(!result)
                return Forbid("You do not have permission to update content or the content does not exist.");

            return Ok(new { message = "Content updated successfully." });
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteContent(int id)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var result = await _contentService.DeleteContentAsync(id, userId);
            if(!result)
                return Forbid("You do not have permission to delete content.");

            return Ok(new { message = "Content deleted successfully." });
        }
    }
}
