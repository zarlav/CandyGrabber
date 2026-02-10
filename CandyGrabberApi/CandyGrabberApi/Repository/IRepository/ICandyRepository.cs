using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface ICandyRepository : IRepository<Candy>
    {
        Task<Candy?> GetByItemIdAsync(int itemId);
        Task<IEnumerable<Candy>> GetAllAsync();
        Task AddAsync(Candy candy);
        void Update(Candy candy);
        Task SaveAsync();
    }
}