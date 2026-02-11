using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IPlayerItemRepository : IRepository<PlayerItem>
    {
        Task<PlayerItem?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<PlayerItem>> GetByPlayerIdAsync(int playerId);
    }
}