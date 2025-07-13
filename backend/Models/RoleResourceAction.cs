namespace Lms_Online.Models
{
    public class RoleResourceAction
    {
        public int RoleId { get; set; }
        public Role Role { get; set; }

        public int ResourceId { get; set; }
        public Resource Resource { get; set; }

        public int ActionId { get; set; }
        public Action Action { get; set; }

        public string Description { get; set; }
    }
}
