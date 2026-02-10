using CandyGrabberApi.DataContext;
using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Repository
{
    public class FriendRequestRepository : Repository<FriendRequest>, IFriendRequestRepository
    {
        private CandyGrabberContext _db;
        public FriendRequestRepository(CandyGrabberContext db) : base(db)
        {
            this._db = db;
        }
        public async Task<FriendRequest?> GetRequestBySenderAndRecipient(int SenderId, int RecipientId)
        {
            var request = await _db.Requests.Where(x => x.SenderId == SenderId && x.RecipientId == RecipientId).FirstOrDefaultAsync();
            return request;
        }
        public async Task<FriendRequest?> GetRequestById(int RequestId)
        {
            var request = await _db.Requests.Where(x => x.Id == RequestId).FirstOrDefaultAsync();
            return request;
        }
        public async Task<List<FriendRequest>?> GetFriendRequestsByUser(int UserId)
        {
            var requests = await _db.Requests.Where(x => x.RecipientId == UserId && x.Status == Domain.Enums.FriendRequestStatus.SENT).ToListAsync();
            return requests;
        }
    }
}
