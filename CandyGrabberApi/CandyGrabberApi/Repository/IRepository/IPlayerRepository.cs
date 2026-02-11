using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IPlayerRepository : IRepository<Player>
    {
        Task<Player?> GetByIdWithUserAndGameAsync(int id);
        Task<Player?> GetPlayerWithItemsAsync(int id);
        Task<IEnumerable<Player>> GetPlayersByGameIdAsync(int gameId);
    }
}