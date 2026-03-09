using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Repository
{
    public class GameRequestRepository : Repository<GameRequest>, IGameRequestRepository
    {
        private readonly CandyGrabberContext _db;

        public GameRequestRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;
        }

        public async Task<GameRequest?> GetGameRequestBySenderAndRecipient(int senderId, int recipientId)
        {

            return await _db.GameRequest
                .Include(x => x.Sender)
                .Include(x => x.Recipient)
                .Where(x => x.SenderId == senderId && x.RecipientId == recipientId)
                .OrderByDescending(x => x.TimeStamp)
                .FirstOrDefaultAsync();
        }

        public async Task<GameRequest?> GetGameRequestById(int gameRequestId)
        {
            return await _db.GameRequest
                .Include(x => x.Sender)
                .Include(x => x.Recipient)
                .Where(x => x.Id == gameRequestId)
                .FirstOrDefaultAsync();
        }

        public async Task<List<GameRequest>> GetAllGameRequestByRecipientId(int recipientId)
        {

            var thresholdTimeUtc = DateTime.UtcNow.AddMinutes(-15);

            return await _db.GameRequest
                .Include(x => x.Sender)
                .Include(x => x.Recipient)
                .Where(x => x.RecipientId == recipientId
                            && x.GameRequestStatus == Domain.Enums.GameRequestStatus.SENT
                            && x.TimeStamp > thresholdTimeUtc)
                .OrderByDescending(x => x.TimeStamp) 
                .ToListAsync();
        }
    }
}