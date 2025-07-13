using Lms_Online.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Quiz
{
    [Key]
    public int QuizId { get; set; }

    [Required]
    [ForeignKey("CoursePresent")]
    public int CoursePresentId { get; set; }

    [Required]
    [MaxLength(100)]
    public string QuizTitle { get; set; }

    [MaxLength(255)]
    public string QuizDescription { get; set; }

    public int MaxScore { get; set; } = 100;

    public DateTime? DueDate { get; set; }

    // Navigation property for the related CoursePresent
    public virtual CoursePresent CoursePresent { get; set; }
}
