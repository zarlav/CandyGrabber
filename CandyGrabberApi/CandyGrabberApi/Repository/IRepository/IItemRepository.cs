using CandyGrabberApi.Domain;
using CandyGrabberApi.Domain.Enums;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IItemRepository : IRepository<Item>
    {
        Task<IEnumerable<Item>> GetByTypeAsync(ItemType type);
    }
}