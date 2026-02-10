using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.CandyGrabberDbContext;
using Microsoft.EntityFrameworkCore;
using CandyGrabberApi.DataContext;

namespace CandyGrabberApi.Repository
{
    public class PowerUpRepository : IPowerUpRepository
    {
        private readonly CandyGrabberContext _db;

        public PowerUpRepository(CandyGrabberContext db)
        {
            _db = db;
        }

        public async Task<PowerUp?> GetByItemIdAsync(int itemId)
        {
            return await _db.Set<PowerUp>()
                .FirstOrDefaultAsync(p => p.ItemId == itemId);
        }

        public async Task<IEnumerable<PowerUp>> GetAllAsync()
        {
            return await _db.Set<PowerUp>()
                .ToListAsync();
        }

        public async Task AddAsync(PowerUp powerUp)
        {
            await _db.Set<PowerUp>().AddAsync(powerUp);
        }

        public void Update(PowerUp powerUp)
        {
            _db.Set<PowerUp>().Update(powerUp);
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}