using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Lms_Online.Models
{
    public class Course
    {
        [Key]
        public int CourseId { get; set; }

        [Required]
        [StringLength(100)]
        public string CourseName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        [ForeignKey("Instructor")]
        public int InstructorId { get; set; }  // FK to User table

        [Required]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public bool IsPublished { get; set; } = false;

        public int? Duration { get; set; }  // Duration in hours or weeks

        [StringLength(100)]
        public string Category { get; set; }

       // [NotMapped]  // Ignore during serialization/validation
        public virtual User Instructor { get; set; }
    }
}
