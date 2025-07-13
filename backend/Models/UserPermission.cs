namespace Lms_Online.Models
{
    public class UserPermission
    {
        public int ResourceId { get; set; }
        public int ActionId { get; set; }
        public string PermissionName { get; set; }
    }
}
