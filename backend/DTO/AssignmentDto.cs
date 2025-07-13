using System;
using System.ComponentModel.DataAnnotations;

namespace Lms_Online.DTO
{
    public class AssignmentDto
    {
        [Required]
        public int CoursePresentId { get; set; }

        [Required]
        [MaxLength(100)]
        public string AssignmentTitle { get; set; }

        [MaxLength(255)]
        public string AssignmentDescription { get; set; }

        public DateTime? DueDate { get; set; }

        public int MaxScore { get; set; } = 100;
    }
}
