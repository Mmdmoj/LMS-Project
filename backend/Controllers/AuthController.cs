using Lms_Online.DTO;
using Lms_Online.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lms_Online.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;

        public AuthController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _userService.RegisterUser(dto.Name, dto.Email, dto.UserName, dto.Password, dto.Role);

            if(result.Success)
            {
                return Ok(new { message = result.Message, token = result.Data });
            }

            return BadRequest(new { message = result.Message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await _userService.AuthenticateUser(dto.UserName, dto.Password);

            if(token != null)
            {
                return Ok(new { message = "Login successful", token });
            }

            return Unauthorized(new { message = "Invalid credentials. Please check your username and password." });
        }
    }
}
