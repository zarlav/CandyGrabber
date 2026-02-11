using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using CandyGrabberApi.DataContext;

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
            return await _db.PlayerItems
                .Include(pi => pi.Item)
                .Include(pi => pi.Player)
                .FirstOrDefaultAsync(pi => pi.Id == id);
        }

        public async Task<IEnumerable<PlayerItem>> GetByPlayerIdAsync(int playerId)
        {
            return await _db.PlayerItems
                .Where(pi => pi.Id == playerId)
                .Include(pi => pi.Item)
                .ToListAsync();
        }
    }
}