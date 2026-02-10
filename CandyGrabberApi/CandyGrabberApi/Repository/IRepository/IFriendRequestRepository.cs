using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IFriendRequestRepository : IRepository<FriendRequest>
    {
        Task<FriendRequest?> GetRequestBySenderAndRecipient(int SenderId, int RecipientId);
        Task<FriendRequest?> GetRequestById(int RequestId);
        Task<List<FriendRequest>?> GetFriendRequestsByUser(int UserId);
    }
}
