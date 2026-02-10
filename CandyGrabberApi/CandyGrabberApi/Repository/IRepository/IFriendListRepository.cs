using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IFriendsListRepository : IRepository<FriendsList>
    {
        Task<List<FriendsList>> GetFriendsListByUser(int UserId);
        Task<FriendsList> GetFriendsListByUserAndFriend(int UserId, int FriendId);
    }
}
