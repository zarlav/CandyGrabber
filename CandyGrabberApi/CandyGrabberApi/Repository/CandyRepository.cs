using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using CandyGrabberApi.DataContext;

namespace CandyGrabberApi.Repository
{
    public class CandyRepository : ICandyRepository
    {
        private readonly CandyGrabberContext _db;

        public CandyRepository(CandyGrabberContext db)
        {
            _db = db;
        }

        public async Task<Candy?> GetByItemIdAsync(int itemId)
        {
            return await _db.Set<Candy>()
                .FirstOrDefaultAsync(c => c.ItemId == itemId);
        }

        public async Task<IEnumerable<Candy>> GetAllAsync()
        {
            return await _db.Set<Candy>()
                .ToListAsync();
        }

        public async Task AddAsync(Candy candy)
        {
            await _db.Set<Candy>().AddAsync(candy);
        }

        public void Update(Candy candy)
        {
            _db.Set<Candy>().Update(candy);
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}