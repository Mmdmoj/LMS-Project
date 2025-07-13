using System.ComponentModel.DataAnnotations;

namespace Lms_Online.DTO
{
    public class CourseCreateDto
    {
        [Required]
        [StringLength(100)]
        public string CourseName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        public bool IsPublished { get; set; } = false;

        public int? Duration { get; set; }

        [StringLength(100)]
        public string Category { get; set; }
    }
}
