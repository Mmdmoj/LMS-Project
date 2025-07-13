using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lms_Online.Models
{
    public class Submission
    {
        [Key]
        public int SubmissionId { get; set; }

        [Required]
        [ForeignKey("Assignment")]
        public int AssignmentId { get; set; }

        [Required]
        [ForeignKey("Enrollment")]
        public int EnrollmentId { get; set; }

        public DateTime SubmissionDate { get; set; } = DateTime.Now;

        public decimal? Grade { get; set; }

        [MaxLength(255)]
        public string Feedback { get; set; }

        // Navigation properties
        public virtual Assignment Assignment { get; set; }
        public virtual Enrollment Enrollment { get; set; }
    }
}
