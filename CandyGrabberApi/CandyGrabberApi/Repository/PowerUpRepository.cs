using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using CandyGrabberApi.DataContext;

namespace CandyGrabberApi.Repository
{
    public class PowerUpRepository : Repository<PowerUp>, IPowerUpRepository
    {
        private readonly CandyGrabberContext _db;

        public PowerUpRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;
        }

        public async Task<PowerUp?> GetByItemIdAsync(int itemId)
        {
            return await _db.PowerUps
                .FirstOrDefaultAsync(p => p.ItemId == itemId);
        }
    }
}