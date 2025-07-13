using System.ComponentModel.DataAnnotations;

namespace Lms_Online.Models
{
    public class Action
    {
        [Key]
        public int ActionId { get; set; }

        [Required]
        public string ActionName { get; set; }

        // Navigation property
        public ICollection<RoleResourceAction> RoleResourceActions { get; set; }
    }
}
