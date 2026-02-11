using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface ICandyRepository : IRepository<Candy>
    {
        Task<Candy?> GetByItemIdAsync(int itemId);
    }
}