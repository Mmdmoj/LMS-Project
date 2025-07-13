using System.ComponentModel.DataAnnotations;

namespace Lms_Online.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }

        [Required]
        public string RoleName { get; set; }

        // Navigation property
        public ICollection<UserRoleAssignment> UserRoleAssignments { get; set; }
        public ICollection<RoleResourceAction> RoleResourceActions { get; set; }
    }
}
