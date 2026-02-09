using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IPlayerRepository
    {
        Task<Player?> GetByIdAsync(int id);
        Task<Player?> GetPlayerWithItemsAsync(int id);
        Task<IEnumerable<Player>> GetPlayersByGameIdAsync(int gameId);
        Task AddAsync(Player player);
        void Update(Player player);
        void Remove(Player player);
        Task SaveAsync();
    }
}