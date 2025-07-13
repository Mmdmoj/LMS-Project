using Lms_Online.Models;

namespace Lms_Online.Repository
{
    public interface IResourceService
    {
        Task<Resource> CreateResource(string resourceName);
        Task<List<Resource>> GetAllResources();
        Task<Resource> GetResourceById(int resourceId);
        Task<bool> UpdateResource(int resourceId, string resourceName);
        Task<bool> DeleteResource(int resourceId);
    }
}
