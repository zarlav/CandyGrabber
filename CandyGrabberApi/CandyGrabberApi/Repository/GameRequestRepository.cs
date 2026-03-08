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
        public async Task<GameRequest> GetGameRequestBySenderAndRecipient(int SenderId, int RecipientId)
        {
            var request = await _db.GameRequest.Where(x => x.SenderId == SenderId && x.RecipientId == RecipientId).FirstOrDefaultAsync();
            return request;
        }

        public async Task<GameRequest> GetGameRequestById(int gameRequestId)
        {
            var request = await _db.GameRequest.Where(x => x.Id == gameRequestId).FirstOrDefaultAsync();
            return request;
        }

        public async Task<List<GameRequest>> GetAllGameRequestByRecipientId(int recipientId)
        {
            var thresholdTimeUtc = DateTime.UtcNow.AddSeconds(-200);

            return await _db.GameRequest
                .Include(x => x.Sender)
                .Include(x => x.Recipient)
                .Where(x => x.RecipientId == recipientId
                            && x.GameRequestStatus == Domain.Enums.GameRequestStatus.SENT
                            && x.TimeStamp > thresholdTimeUtc)
                .ToListAsync();
        }

    }
}
