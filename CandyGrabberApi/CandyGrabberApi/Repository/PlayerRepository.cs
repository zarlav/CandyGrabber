using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using CandyGrabberApi.DataContext;

namespace CandyGrabberApi.Repository
{
    public class PlayerRepository : Repository<Player>, IPlayerRepository
    {
        private readonly CandyGrabberContext _db;

        public PlayerRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;
        }

        public async Task<Player?> GetByIdWithUserAndGameAsync(int id)
        {
            return await _db.Players!
                .Include(p => p.User)
                .Include(p => p.Game)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Player?> GetPlayerWithItemsAsync(int id)
        {
            return await _db.Players!
                .Include(p => p.PlayerItems)
                    .ThenInclude(pi => pi.Item)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Player>> GetPlayersByGameIdAsync(int gameId)
        {
            return await _db.Players!
                .Where(p => p.GameId == gameId)
                .Include(p => p.User)
                .ToListAsync();
        }
    }
}