using Lms_Online.Models;

namespace Lms_Online.Repository
{
    public interface IUserService
    {
        Task<ServiceResponse<string>> RegisterUser(string name, string email, string userName, string password, string roleName);
        Task<string> AuthenticateUser(string userName, string password);


    }
}
