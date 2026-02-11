using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Repository
{
    public class FriendsListRepository : Repository<FriendsList>, IFriendsListRepository
    {
        private CandyGrabberContext _db;
        public FriendsListRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;

        }
        public async Task<List<FriendsList>> GetFriendsListByUser(int UserId)
        {
            var friends = await _db.FriendsList.Include(x => x.Friend).Include(x => x.User).Where(x => x.UserId == UserId).ToListAsync();
            return friends;
        }
        public async Task<FriendsList> GetFriendsListByUserAndFriend(int UserId, int FriendId)
        {
            var friendship = await _db.FriendsList.Where(x => x.UserId == UserId && x.FriendId == FriendId).FirstOrDefaultAsync();
            return friendship;
        }
    }
}
