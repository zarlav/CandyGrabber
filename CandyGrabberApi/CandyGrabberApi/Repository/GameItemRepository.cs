using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using CandyGrabberApi.DataContext;

namespace CandyGrabberApi.Repository
{
    public class GameItemRepository : IGameItemRepository
    {
        private readonly CandyGrabberContext _db;

        public GameItemRepository(CandyGrabberContext db)
        {
            _db = db;
        }

        public async Task<GameItem?> GetByIdAsync(int id)
        {
            return await _db.GameItems!
                .Include(gi => gi.Item)
                .FirstOrDefaultAsync(gi => gi.Id == id);
        }

        public async Task<IEnumerable<GameItem>> GetItemsByGameIdAsync(int gameId)
        {
            return await _db.GameItems!
                .Where(gi => gi.GameId == gameId)
                .Include(gi => gi.Item)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameItem>> GetActiveItemsByGameIdAsync(int gameId)
        {
            return await _db.GameItems!
                .Where(gi => gi.GameId == gameId && !gi.IsCollected)
                .Include(gi => gi.Item)
                .ToListAsync();
        }

        public async Task AddAsync(GameItem gameItem)
        {
            await _db.GameItems!.AddAsync(gameItem);
        }

        public void Update(GameItem gameItem)
        {
            _db.GameItems!.Update(gameItem);
        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}