using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

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
            return await _db.PowerUp
                .FirstOrDefaultAsync(p => p.ItemId == itemId);
        }
    }
}