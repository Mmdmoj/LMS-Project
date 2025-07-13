using System.ComponentModel.DataAnnotations;

public class SubmissionDto
{
    [Required]
    public int AssignmentId { get; set; }

    [Required]
    public int EnrollmentId { get; set; }

    public DateTime SubmissionDate { get; set; } = DateTime.Now;

    public decimal? Grade { get; set; }

    [MaxLength(255)]
    public string Feedback { get; set; }
}
