using CandyGrabberApi.Domain;
using CandyGrabberApi.Domain.Enums;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Repository
{
    public class ItemRepository : Repository<Item>, IItemRepository
    {
        private readonly CandyGrabberContext _db;

        public ItemRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Item>> GetByTypeAsync(ItemType type)
        {
            return await _db.Item
                .Where(i => i.Type == type)
                .ToListAsync();
        }
    }
}