using System;
using System.ComponentModel.DataAnnotations;

namespace Lms_Online.DTO
{
    public class QuizDto
    {
        [Required]
        public int CoursePresentId { get; set; }

        [Required]
        [MaxLength(100)]
        public string QuizTitle { get; set; }

        [MaxLength(255)]
        public string QuizDescription { get; set; }

        public int MaxScore { get; set; } = 100;

        public DateTime? DueDate { get; set; }
    }
}
