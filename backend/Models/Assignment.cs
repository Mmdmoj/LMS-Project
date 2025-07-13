using Lms_Online.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Assignment
{
    [Key]
    public int AssignmentId { get; set; }

    [Required]
    [ForeignKey("CoursePresent")]
    public int CoursePresentId { get; set; }

    [Required]
    [MaxLength(100)]
    public string AssignmentTitle { get; set; }

    [MaxLength(255)]
    public string AssignmentDescription { get; set; }

    public DateTime? DueDate { get; set; }

    public int MaxScore { get; set; } = 100;

    // Navigation property for related CoursePresent
    public virtual CoursePresent CoursePresent { get; set; }
}
