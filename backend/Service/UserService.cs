using Lms_Online.Data;
using Lms_Online.Repository;
using Lms_Online.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Lms_Online.Service
{
    public class UserService : IUserService 
    {
        private readonly LmsDbContext _context;
        private readonly IConfiguration _configuration;

        public UserService(LmsDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<ServiceResponse<string>> RegisterUser(string name, string email, string userName, string password, string roleName)
        {
            var response = new ServiceResponse<string>();

            // Check if the user already exists
            var existingUser = await _context.Users.AnyAsync(u => u.Email == email || u.UserName == userName);
            if(existingUser)
            {
                response.Success = false;
                response.Message = "User with this email or username already exists.";
                return response;
            }

            // Hash the password
            var hashedPassword = HashPassword(password);

            // Create a new user object
            var newUser = new User
            {
                Name = name,
                Email = email,
                UserName = userName,
                Password = hashedPassword // Save hashed password
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            // Fetch the role to assign
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
            if(role == null)
            {
                response.Success = false;
                response.Message = "Role not found.";
                return response;
            }

            // Assign the role to the new user
            var userRoleAssignment = new UserRoleAssignment
            {
                UserId = newUser.UserId,
                RoleId = role.RoleId
            };

            await _context.UserRoleAssignments.AddAsync(userRoleAssignment);
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = await AuthenticateUser(newUser.UserName, password);
            if(token == null)
            {
                response.Success = false;
                response.Message = "Failed to generate token.";
                return response;
            }

            // Return token in response
            response.Success = true;
            response.Data = token;
            response.Message = "Registration successful. Token generated.";
            return response;
        }

        public async Task<string> AuthenticateUser(string userName, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            if(user == null || !VerifyPassword(password, user.Password))
                return null; // Authentication fails

            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Role, GetUserRole(user.UserId)) // Fetch role from DB
                }),
                Expires = DateTime.UtcNow.AddMonths(1),
                Issuer = _configuration["JWT:ValidIssuer"],
                Audience = _configuration["JWT:ValidAudience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using(var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }

        private bool VerifyPassword(string enteredPassword, string storedHash)
        {
            return HashPassword(enteredPassword) == storedHash;
        }

        private string GetUserRole(int userId)
        {
            var userRole = _context.UserRoleAssignments
                .Include(ur => ur.Role)
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.Role.RoleName)
                .FirstOrDefault();

            return userRole ?? "Student"; // Default to "Student" if no role found
        }
    }
}
