using System;
using System.ComponentModel.DataAnnotations;

namespace Lms_Online.DTO
{
    public class CoursePresentDto
    {
        [Required]
        public int CourseId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? MaxEnrollments { get; set; }

        public bool ProgressTrackingEnabled { get; set; } = true;
    }
}
