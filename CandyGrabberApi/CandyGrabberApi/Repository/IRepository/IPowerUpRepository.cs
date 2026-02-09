using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IPowerUpRepository
    {
        Task<PowerUp?> GetByItemIdAsync(int itemId);
        Task<IEnumerable<PowerUp>> GetAllAsync();
        Task AddAsync(PowerUp powerUp);
        void Update(PowerUp powerUp);
        Task SaveAsync();
    }
}