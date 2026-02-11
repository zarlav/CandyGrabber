using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IPowerUpRepository : IRepository<PowerUp>
    {
        Task<PowerUp?> GetByItemIdAsync(int itemId);
    }
}