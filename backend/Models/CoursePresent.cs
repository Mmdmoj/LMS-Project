using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lms_Online.Models
{
    public class CoursePresent
    {
        [Key]
        public int CoursePresentId { get; set; }

        [Required]
        [ForeignKey("Course")]
        public int CourseId { get; set; }  // FK to Course table

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? MaxEnrollments { get; set; }

        public int CurrentEnrollments { get; set; } = 0;

        public bool ProgressTrackingEnabled { get; set; } = true;

        // Navigation property for the related Course
        public virtual Course Course { get; set; }
    }
}
