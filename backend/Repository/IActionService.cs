namespace Lms_Online.Repository
{
    public interface IActionService
    {
        Task<Models.Action> CreateAction(string actionName);
        Task<List<Models.Action>> GetAllActions();
        Task<Models.Action> GetActionById(int actionId);
        Task<bool> UpdateAction(int actionId, string actionName);
        Task<bool> DeleteAction(int actionId);

    }
}
