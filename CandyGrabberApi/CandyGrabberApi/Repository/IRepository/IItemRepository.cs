using CandyGrabberApi.Domain;
using CandyGrabberApi.Domain.Enums;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IItemRepository
    {
        Task<Item?> GetByIdAsync(int id);
        Task<IEnumerable<Item>> GetAllAsync();
        Task AddAsync(Item item);
        void Update(Item item);
        void Remove(Item item);
        Task<IEnumerable<Item>> GetByTypeAsync(ItemType type);
        Task SaveAsync();
    }
}