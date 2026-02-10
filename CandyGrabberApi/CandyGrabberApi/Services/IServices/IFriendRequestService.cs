using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;

namespace CandyGrabberApi.Services.IServices
{
    public interface IFriendRequestService
    {
        Task SendFriendRequest(FriendRequestDTO request);
        Task AcceptFriendRequest(int requestId);
        Task DeclineFriendRequest(int requestId);
        Task<bool> CheckIfFriendRequestSent(string UserName, string FriendName);
        Task<List<Request>> GetAllFriendRequestsForUser(int UserId);
    }
}
