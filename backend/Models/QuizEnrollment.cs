using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lms_Online.Models
{
    public class QuizEnrollment
    {
        [Key, Column(Order = 0)]
        [ForeignKey("Quiz")]
        public int QuizId { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey("Enrollment")]
        public int EnrollmentId { get; set; }

        public decimal? Score { get; set; }

        // Navigation properties
        public virtual Quiz Quiz { get; set; }
        public virtual Enrollment Enrollment { get; set; }
    }
}
