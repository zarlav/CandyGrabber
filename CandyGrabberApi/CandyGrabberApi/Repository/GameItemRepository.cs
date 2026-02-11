using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Repository
{
    public class GameItemRepository : Repository<GameItem>, IGameItemRepository
    {
        private readonly CandyGrabberContext _db;

        public GameItemRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;
        }

        public async Task<GameItem?> GetByIdWithItemAsync(int id)
        {
            return await _db.GameItem!
                .Include(gi => gi.Item)
                .FirstOrDefaultAsync(gi => gi.Id == id);
        }

        public async Task<IEnumerable<GameItem>> GetItemsByGameIdAsync(int gameId)
        {
            return await _db.GameItem!
                .Where(gi => gi.GameId == gameId)
                .Include(gi => gi.Item)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameItem>> GetActiveItemsByGameIdAsync(int gameId)
        {
            return await _db.GameItem!
                .Where(gi => gi.GameId == gameId && !gi.IsCollected)
                .Include(gi => gi.Item)
                .ToListAsync();
        }
    }
}