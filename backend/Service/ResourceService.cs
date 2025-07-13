using Lms_Online.Data;
using Lms_Online.Models;
using Microsoft.EntityFrameworkCore;

namespace Lms_Online.Service
{
    public class ResourceService : Repository.IResourceService
    {
        private readonly LmsDbContext _context;

        public ResourceService(LmsDbContext context)
        {
            _context = context;
        }


        public async Task<Resource> CreateResource(string resourceName)
        {
            var resource = new Resource
            {
                ResourceName = resourceName
            };

            _context.Resources.Add(resource);
            await _context.SaveChangesAsync();

            return resource;
        }


        public async Task<List<Resource>> GetAllResources()
        {
            return await _context.Resources.ToListAsync();
        }


        public async Task<Resource> GetResourceById(int resourceId)
        {
            return await _context.Resources.FirstOrDefaultAsync(r => r.ResourceId == resourceId);
        }


        public async Task<bool> UpdateResource(int resourceId, string resourceName)
        {
            var resource = await _context.Resources.FirstOrDefaultAsync(r => r.ResourceId == resourceId);

            if(resource == null)
            {
                return false;
            }

            resource.ResourceName = resourceName;
            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<bool> DeleteResource(int resourceId)
        {
            var resource = await _context.Resources.FirstOrDefaultAsync(r => r.ResourceId == resourceId);

            if(resource == null)
            {
                return false;
            }

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
