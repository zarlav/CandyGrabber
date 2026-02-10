using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.CandyGrabberDbContext;
using Microsoft.EntityFrameworkCore;
using CandyGrabberApi.DataContext;

namespace CandyGrabberApi.Repository
{
    public class PlayerRepository : IPlayerRepository
    {
        private readonly CandyGrabberContext _db;

        public PlayerRepository(CandyGrabberContext db)
        {
            _db = db;
        }

        public async Task<Player?> GetByIdAsync(int id)
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
                .Where(p => p.Game.Id == gameId)
                .Include(p => p.User)
                .ToListAsync();
        }

        public async Task AddAsync(Player player)
        {
            await _db.Players!.AddAsync(player);
        }

        public void Update(Player player)
        {
            _db.Players!.Update(player);
        }

        public void Remove(Player player)
        {
            _db.Players!.Remove(player);
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}