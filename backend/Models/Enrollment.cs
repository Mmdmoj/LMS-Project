using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lms_Online.Models
{
    public class Enrollment
    {
        [Key]
        public int EnrollmentId { get; set; }

        [ForeignKey("Student")]
        public int StudentId { get; set; }  // FK to User table

        [ForeignKey("CoursePresent")]
        public int CoursePresentId { get; set; }  // FK to CoursePresent table

        [Required]
        public DateTime EnrollmentDate { get; set; } = DateTime.Now;

        [StringLength(50)]
        public string Status { get; set; } = "Active";

        public decimal Progress { get; set; } = 0.00M;

        public decimal? FinalGrade { get; set; }

        // Navigation properties
        public virtual User Student { get; set; }  // Navigation to User (Student)
        public virtual CoursePresent CoursePresent { get; set; }  // Navigation to CoursePresent
    }
}
