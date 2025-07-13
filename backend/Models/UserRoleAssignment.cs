namespace Lms_Online.Models
{
    public class UserRoleAssignment
    {
        public int UserId { get; set; }
        public User User { get; set; } // Navigation property to User

        public int RoleId { get; set; }
        public Role Role { get; set; } // Navigation property to Role
    }
}
