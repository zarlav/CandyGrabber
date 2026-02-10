using CandyGrabberApi.DataContext;
using CandyGrabberApi.Domain;
using CandyGrabberApi.Domain.Enums;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Repository
{
    public class ItemRepository :Repository<ItemRepository>, IItemRepository
    {
        private CandyGrabberContext _db;

        public ItemRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;
        }

        public async Task<Item?> GetByIdAsync(int id)
        {
            return await _db.Set<Item>()
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<IEnumerable<Item>> GetAllAsync()
        {
            return await _db.Set<Item>().ToListAsync();
        }

        public async Task<IEnumerable<Item>> GetByTypeAsync(ItemType type)
        {
            return await _db.Set<Item>()
                .Where(i => i.Type == type)
                .ToListAsync();
        }

        public async Task AddAsync(Item item)
        {
            await _db.Set<Item>().AddAsync(item);
        }

        public void Update(Item item)
        {
            _db.Set<Item>().Update(item);
        }

        public void Remove(Item item)
        {
            _db.Set<Item>().Remove(item);
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}