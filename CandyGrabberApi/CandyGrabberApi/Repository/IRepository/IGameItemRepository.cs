using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IGameItemRepository : IRepository<GameItem>
    {
        Task<GameItem?> GetByIdWithItemAsync(int id);
        Task<IEnumerable<GameItem>> GetItemsByGameIdAsync(int gameId);
        Task<IEnumerable<GameItem>> GetActiveItemsByGameIdAsync(int gameId);

    }
}