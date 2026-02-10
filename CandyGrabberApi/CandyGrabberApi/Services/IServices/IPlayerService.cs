using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Services.IServices
{
    public interface IPlayerService
    {
        Task<Player?> GetPlayerByIdAsync(int playerId);
        Task<IEnumerable<Player>> GetPlayersByGameAsync(int gameId);
        Task<bool> CollectItemAsync(int playerId, int gameItemId);   
        Task<IEnumerable<PlayerItem>> GetPlayerInventoryAsync(int playerId);
        Task<bool> UsePowerUpAsync(int playerId, int playerItemId);  
    }
}