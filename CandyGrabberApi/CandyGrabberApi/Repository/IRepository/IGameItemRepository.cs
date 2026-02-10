using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IGameItemRepository
    {
        Task<GameItem?> GetByIdAsync(int id);
        Task<IEnumerable<GameItem>> GetItemsByGameIdAsync(int gameId);
        Task<IEnumerable<GameItem>> GetActiveItemsByGameIdAsync(int gameId);
        Task AddAsync(GameItem gameItem);
        void Update(GameItem gameItem);
        Task SaveAsync();
    }
}