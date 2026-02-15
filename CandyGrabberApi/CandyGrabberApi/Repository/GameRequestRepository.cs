using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Repository
{
    public class GameRequestRepository : Repository<GameRequest>, IGameRequestRepository
    {
        private CandyGrabberContext _db;
        public GameRequestRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;
        }
        public async Task<GameRequest> GetGameRequestBySenderAndRecipient(int SenderId, int RecipientId, int gameId)
        {
            var request = await _db.GameRequest.Where(x => x.SenderId == SenderId && x.RecipientId == RecipientId && x.GameId == gameId).FirstOrDefaultAsync();
            return request;
        }

        public async Task<GameRequest> GetGameRequestById(int gameRequestId)
        {
            var request = await _db.GameRequest.Where(x => x.Id == gameRequestId).FirstOrDefaultAsync();
            return request;
        }

        public async Task<List<GameRequest>> GetAllGameRequestByRecipientId(int recipientId)
        {
            var thresholdTime = DateTime.UtcNow.AddSeconds(-20);

            return await this._db.GameRequest
                .Include(x => x.Sender)
                .Include(x => x.Recipient)
                .Where(x => x.RecipientId == recipientId && x.TimeStamp > thresholdTime)
                .Where(x => x.GameRequestStatus == Domain.Enums.GameRequestStatus.SENT)
                .ToListAsync();
        }

        public async Task<List<GameRequest>> GetGameRequests(int gameId)
        {
            return await this._db.GameRequest
                .Where(x => x.GameId == gameId)
                .Where(x => x.GameRequestStatus == Domain.Enums.GameRequestStatus.SENT)
                .ToListAsync();
        }
    }
}
