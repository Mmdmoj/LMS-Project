using Lms_Online.Data;
using Lms_Online.DTO;
using Lms_Online.Models;
using Lms_Online.Repository;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Lms_Online.Service
{
    public class AssignmentService : IAssignmentService
    {
        private readonly LmsDbContext _context;
        private readonly IRoleResourceActionService _roleResourceActionService;

        public AssignmentService(LmsDbContext context, IRoleResourceActionService roleResourceActionService)
        {
            _context = context;
            _roleResourceActionService = roleResourceActionService;
        }

        private async Task<bool> CheckPermission(int userId, string resource, string action) =>
            await _roleResourceActionService.HasPermission(userId, resource, action);

        public async Task<Assignment> CreateAssignmentAsync(AssignmentDto assignmentDto, int userId)
        {
            if(!await CheckPermission(userId, "Assignment", "Create"))
                return null;

            var assignment = new Assignment
            {
                CoursePresentId = assignmentDto.CoursePresentId,
                AssignmentTitle = assignmentDto.AssignmentTitle,
                AssignmentDescription = assignmentDto.AssignmentDescription,
                DueDate = assignmentDto.DueDate,
                MaxScore = assignmentDto.MaxScore
            };

            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();

            return assignment;
        }

        public async Task<List<Assignment>> GetAllAssignmentsAsync(int userId)
        {
            if(!await CheckPermission(userId, "Assignment", "View"))
                return null;

            return await _context.Assignments
                .Include(a => a.CoursePresent) // Include related entities if needed
                .ToListAsync();
        }

        public async Task<Assignment> GetAssignmentByIdAsync(int assignmentId, int userId)
        {
            if(!await CheckPermission(userId, "Assignment", "View"))
                return null;

            return await _context.Assignments
                .Include(a => a.CoursePresent)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);
        }

        public async Task<bool> UpdateAssignmentAsync(int assignmentId, AssignmentDto assignmentDto, int userId)
        {
            if(!await CheckPermission(userId, "Assignment", "Update"))
                return false;

            var assignment = await _context.Assignments.FindAsync(assignmentId);
            if(assignment == null)
                return false;

            assignment.AssignmentTitle = assignmentDto.AssignmentTitle;
            assignment.AssignmentDescription = assignmentDto.AssignmentDescription;
            assignment.DueDate = assignmentDto.DueDate;
            assignment.MaxScore = assignmentDto.MaxScore;

            _context.Assignments.Update(assignment);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAssignmentAsync(int assignmentId, int userId)
        {
            if(!await CheckPermission(userId, "Assignment", "Delete"))
                return false;

            var assignment = await _context.Assignments.FindAsync(assignmentId);
            if(assignment == null)
                return false;

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
