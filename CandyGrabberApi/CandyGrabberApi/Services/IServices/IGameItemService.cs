using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Services.IServices
{
    public interface IGameItemService
    {
        Task<IEnumerable<GameItem>> GetActiveItemsInGameAsync(int gameId);
        Task<GameItem?> GetGameItemByIdAsync(int id);
        Task SpawnItemsForGameAsync(int gameId); 
        Task<bool> MarkItemAsCollectedAsync(int gameItemId);
        Task<GameItem?> GetItemAtPositionAsync(int gameId, int x, int y);
    }
}