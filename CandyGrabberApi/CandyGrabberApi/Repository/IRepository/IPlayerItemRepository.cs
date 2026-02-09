using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IPlayerItemRepository
    {
        Task<PlayerItem?> GetByIdAsync(int id);
        Task<IEnumerable<PlayerItem>> GetByPlayerIdAsync(int playerId);
        Task AddAsync(PlayerItem playerItem);
        void Update(PlayerItem playerItem);
        void Remove(PlayerItem playerItem);
        Task SaveAsync();
    }
}