using System.ComponentModel.DataAnnotations;

namespace Lms_Online.DTO
{
    public class QuizEnrollmentDto
    {
        [Required]
        public int QuizId { get; set; }

        [Required]
        public int EnrollmentId { get; set; }

        public decimal? Score { get; set; }
    }
}
