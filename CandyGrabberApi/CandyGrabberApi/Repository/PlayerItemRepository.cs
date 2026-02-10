using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using CandyGrabberApi.DataContext;

namespace CandyGrabberApi.Repository
{
    public class PlayerItemRepository : Repository<PlayerItem>,  IPlayerItemRepository
    {
        private readonly CandyGrabberContext _db;

        public PlayerItemRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;
        }

        public async Task<PlayerItem?> GetByIdAsync(int id)
        {
            return await _db.Set<PlayerItem>()
                .Include(pi => pi.Item)
                .Include(pi => pi.Player)
                .FirstOrDefaultAsync(pi => pi.Id == id);
        }

        public async Task<IEnumerable<PlayerItem>> GetByPlayerIdAsync(int playerId)
        {
            return await _db.Set<PlayerItem>()
                .Where(pi => pi.Player.Id == playerId)
                .Include(pi => pi.Item)
                .ToListAsync();
        }

        public async Task AddAsync(PlayerItem playerItem)
        {
            await _db.Set<PlayerItem>().AddAsync(playerItem);
        }

        public void Update(PlayerItem playerItem)
        {
            _db.Set<PlayerItem>().Update(playerItem);
        }

        public void Remove(PlayerItem playerItem)
        {
            _db.Set<PlayerItem>().Remove(playerItem);
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}