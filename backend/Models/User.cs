using System.ComponentModel.DataAnnotations;

namespace Lms_Online.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        // Navigation properties
        public ICollection<UserRoleAssignment> UserRoleAssignments { get; set; }
    }
}
