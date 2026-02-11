using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Repository
{
    public class PlayerItemRepository : Repository<PlayerItem>, IPlayerItemRepository
    {
        private readonly CandyGrabberContext _db;

        public PlayerItemRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;
        }

        public async Task<PlayerItem?> GetByIdWithDetailsAsync(int id)
        {
            return await _db.PlayerItem
                .Include(pi => pi.Item)
                .Include(pi => pi.Player)
                .FirstOrDefaultAsync(pi => pi.Id == id);
        }

        public async Task<IEnumerable<PlayerItem>> GetByPlayerIdAsync(int playerId)
        {
            return await _db.PlayerItem
                .Where(pi => pi.Id == playerId)
                .Include(pi => pi.Item)
                .ToListAsync();
        }
    }
}