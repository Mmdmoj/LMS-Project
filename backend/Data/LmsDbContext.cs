using Lms_Online.Models;
using Microsoft.EntityFrameworkCore;

namespace Lms_Online.Data
{
    public class LmsDbContext : DbContext
    {
        public LmsDbContext(DbContextOptions<LmsDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRoleAssignment> UserRoleAssignments { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Models.Action> Actions { get; set; }
        public DbSet<RoleResourceAction> RoleResourceActions { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<CoursePresent> CoursePresents { get; set; }
        public DbSet<Content> Contents { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<QuizEnrollment> quizEnrollments { get; set; }
        public DbSet<UserPermission> Permissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");
                entity.HasKey(u => u.UserId);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.UserName).IsUnique();
            });

            // Role configuration
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Role");
                entity.HasKey(r => r.RoleId);
            });

            // UserRoleAssignment composite key configuration
            modelBuilder.Entity<UserRoleAssignment>()
                .ToTable("UserRoleAssignment")
                .HasKey(ura => new { ura.UserId, ura.RoleId });

            // Action configuration
            modelBuilder.Entity<Models.Action>(entity =>
            {
                entity.ToTable("Action");
                entity.HasKey(a => a.ActionId);
            });

            // Resource configuration
            modelBuilder.Entity<Resource>()
                .ToTable("Resource");

            // RoleResourceAction composite key configuration
            modelBuilder.Entity<RoleResourceAction>()
                .ToTable("RoleResourceAction")
                .HasKey(rra => new { rra.RoleId, rra.ResourceId, rra.ActionId });

            // Course configuration
            modelBuilder.Entity<Course>(entity =>
            {
                entity.ToTable("Course");
                entity.HasKey(c => c.CourseId);
                entity.Property(c => c.CourseName)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(c => c.Description)
                    .HasMaxLength(255);
                entity.Property(c => c.CreatedDate)
                    .HasDefaultValueSql("GETDATE()");
                entity.HasOne(c => c.Instructor)
                    .WithMany()
                    .HasForeignKey(c => c.InstructorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Enrollment configuration
            modelBuilder.Entity<Enrollment>(entity =>
            {
                entity.ToTable("Enrollment");
                entity.HasKey(e => e.EnrollmentId);
                entity.Property(e => e.Status)
                    .HasDefaultValue("Active")
                    .HasMaxLength(50);
                entity.Property(e => e.Progress)
                    .HasDefaultValue(0.00M);
                entity.Property(e => e.EnrollmentDate)
                    .HasDefaultValueSql("GETDATE()");
                entity.HasOne(e => e.Student)
                    .WithMany()
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.CoursePresent)
                    .WithMany()
                    .HasForeignKey(e => e.CoursePresentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // CoursePresent configuration
            modelBuilder.Entity<CoursePresent>(entity =>
            {
                entity.ToTable("CoursePresent");
                entity.HasKey(cp => cp.CoursePresentId);
            });

            // Content configuration
            modelBuilder.Entity<Content>(entity =>
            {
                entity.ToTable("Content");
                entity.HasKey(c => c.ContentId);
                entity.Property(c => c.ContentType)
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(c => c.ContentURL)
                    .IsRequired()
                    .HasMaxLength(255);
                entity.Property(c => c.CreatedDate)
                    .HasDefaultValueSql("GETDATE()");
                entity.Property(c => c.Description)
                    .HasMaxLength(255);
                entity.HasOne(c => c.CoursePresent)
                    .WithMany()
                    .HasForeignKey(c => c.CoursePresentId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Content_CoursePresentId");
            });

            // Assignment configuration
            modelBuilder.Entity<Assignment>(entity =>
            {
                entity.ToTable("Assignment");
                entity.HasKey(a => a.AssignmentId);
                entity.Property(a => a.AssignmentTitle)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(a => a.AssignmentDescription)
                    .HasMaxLength(255);
                entity.Property(a => a.DueDate)
                    .IsRequired(false);
                entity.Property(a => a.MaxScore)
                    .HasDefaultValue(100);
                entity.HasOne(a => a.CoursePresent)
                    .WithMany()
                    .HasForeignKey(a => a.CoursePresentId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Assignment_CoursePresentId");
            });

            // Submission configuration
            modelBuilder.Entity<Submission>(entity =>
            {
                entity.ToTable("Submission");
                entity.HasKey(s => s.SubmissionId);
                entity.Property(s => s.SubmissionDate)
                    .HasDefaultValueSql("GETDATE()");
                entity.Property(s => s.Grade)
                    .HasColumnType("decimal(5,2)")
                    .IsRequired(false);
                entity.Property(s => s.Feedback)
                    .HasMaxLength(255);
                entity.HasOne(s => s.Assignment)
                    .WithMany()
                    .HasForeignKey(s => s.AssignmentId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Submission_AssignmentId");
                entity.HasOne(s => s.Enrollment)
                    .WithMany()
                    .HasForeignKey(s => s.EnrollmentId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Submission_EnrollmentId");
            });

            // Quiz configuration
            modelBuilder.Entity<Quiz>(entity =>
            {
                entity.ToTable("Quiz");
                entity.HasKey(q => q.QuizId);
                entity.Property(q => q.QuizTitle)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(q => q.QuizDescription)
                    .HasMaxLength(255);
                entity.HasOne(q => q.CoursePresent)
                    .WithMany()
                    .HasForeignKey(q => q.CoursePresentId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Quiz_CoursePresentId");
            });
            modelBuilder.Entity<QuizEnrollment>(entity =>
            {
                entity.ToTable("QuizEnrollment");

                // Composite primary key for QuizId and EnrollmentId
                entity.HasKey(qe => new { qe.QuizId, qe.EnrollmentId });

                // Score property configuration
                entity.Property(qe => qe.Score)
                      .HasColumnType("decimal(5,2)")
                      .IsRequired(false);

                // Foreign key relationship to Quiz
                entity.HasOne(qe => qe.Quiz)
                      .WithMany()
                      .HasForeignKey(qe => qe.QuizId)
                      .OnDelete(DeleteBehavior.Cascade)
                      .HasConstraintName("FK_QuizEnrollment_QuizId");

                // Foreign key relationship to Enrollment
                entity.HasOne(qe => qe.Enrollment)
                      .WithMany()
                      .HasForeignKey(qe => qe.EnrollmentId)
                      .OnDelete(DeleteBehavior.Cascade)
                      .HasConstraintName("FK_QuizEnrollment_EnrollmentId");
            });
            modelBuilder.Entity<UserPermission>().HasNoKey(); // Specify no key
            base.OnModelCreating(modelBuilder);
        }
    }
}
