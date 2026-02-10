using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Services.IServices
{
    public interface IFriendsListService
    {
        Task CreateFriendship(int requestId);
        Task<List<FriendsList>> GetAllFriendsForUser(int UserId);
        Task<bool> CheckIfFriends(string UserName, string FriendName);
    }
}
