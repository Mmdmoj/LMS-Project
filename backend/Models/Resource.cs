using System.ComponentModel.DataAnnotations;

namespace Lms_Online.Models
{
    public class Resource
    {
        [Key]
        public int ResourceId { get; set; }

        [Required]
        public string ResourceName { get; set; }

        // Navigation property
        public ICollection<RoleResourceAction> RoleResourceActions { get; set; }
    }
}
