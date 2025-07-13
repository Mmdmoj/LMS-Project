using Lms_Online.Models;
using Lms_Online.Data;
using Lms_Online.Service;
using Microsoft.EntityFrameworkCore;

namespace Lms_Online.Repository
{
    public class ContentService : IContentService
    {
        private readonly LmsDbContext _context;
        private readonly IRoleResourceActionService _roleResourceActionService;

        public ContentService(LmsDbContext context, IRoleResourceActionService roleResourceActionService)
        {
            _context = context;
            _roleResourceActionService = roleResourceActionService;
        }

        private async Task<bool> CheckPermission(int userId, string resource, string action) =>
            await _roleResourceActionService.HasPermission(userId, resource, action);

        public async Task<bool> AddContentAsync(Content content, int userId)
        {
            if(!await CheckPermission(userId, "Content", "Create"))
                return false;

            content.CreatedDate = DateTime.UtcNow;  // Store in UTC
            _context.Contents.Add(content);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Content>> GetAllContentByCoursePresentIdAsync(int coursePresentId, int userId)
        {
            if(!await CheckPermission(userId, "Content", "View"))
                return null;

            return await _context.Contents
                .AsNoTracking()
                .Where(c => c.CoursePresentId == coursePresentId)
                .ToListAsync();
        }

        public async Task<Content> GetContentByIdAsync(int contentId, int userId)
        {
            if(!await CheckPermission(userId, "Content", "View"))
                return null;

            return await _context.Contents
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.ContentId == contentId);
        }

        public async Task<bool> UpdateContentAsync(Content content, int coursePresentId, int userId)
        {
            // Check if the user has permission to update content
            if(!await CheckPermission(userId, "Content", "Update"))
                return false;

            // Verify the content exists and belongs to the specified course
            var existingContent = await _context.Contents
                .FirstOrDefaultAsync(c => c.ContentId == content.ContentId && c.CoursePresentId == coursePresentId);

            if(existingContent == null)
                return false;

            // Update the content's properties
            existingContent.ContentType = content.ContentType;
            existingContent.ContentURL = content.ContentURL;
            existingContent.Description = content.Description;

            // Save the changes to the database
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteContentAsync(int contentId, int userId)
        {
            if(!await CheckPermission(userId, "Content", "Delete"))
                return false;

            var content = await _context.Contents.FindAsync(contentId);
            if(content == null)
                return false;

            _context.Contents.Remove(content);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
