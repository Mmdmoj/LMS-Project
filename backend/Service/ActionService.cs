using Lms_Online.Data;
using Lms_Online.Repository;
using Microsoft.EntityFrameworkCore;

namespace Lms_Online.Service
{
    public class ActionService : IActionService
    {
        private readonly LmsDbContext _context;

        public ActionService(LmsDbContext context)
        {
            _context = context;
        }

        public async Task<Models.Action> CreateAction(string actionName)
        {
            var action = new Models.Action
            {
                ActionName = actionName
            };

            _context.Actions.Add(action);
            await _context.SaveChangesAsync();

            return action;
        }

        public async Task<List<Models.Action>> GetAllActions()
        {
            return await _context.Actions.ToListAsync();
        }

        public async Task<Models.Action> GetActionById(int actionId)
        {
            return await _context.Actions.FirstOrDefaultAsync(a => a.ActionId == actionId);
        }

        public async Task<bool> UpdateAction(int actionId, string actionName)
        {
            var action = await _context.Actions.FirstOrDefaultAsync(a => a.ActionId == actionId);

            if(action == null)
            {
                return false;
            }

            action.ActionName = actionName;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAction(int actionId)
        {
            var action = await _context.Actions.FirstOrDefaultAsync(a => a.ActionId == actionId);

            if(action == null)
            {
                return false;
            }

            _context.Actions.Remove(action);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
