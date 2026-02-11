using CandyGrabberApi.DataContext;
using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;

namespace CandyGrabberApi.Services
{
    public class FriendsListService : IFriendsListService
    {
        private readonly CandyGrabberContext _db;
        public IUnitOfWork _unitOfWork { get; set; }

        public async Task<bool> CheckIfFriends(string UserName, string FriendName)
        {
            var friend1 = await this._unitOfWork.User.GetUserByUsername(UserName);
            var friend2 = await this._unitOfWork.User.GetUserByUsername(FriendName);
            if (friend1 == null || friend2 == null)
            {
                return false;
            }
            var friendsList = await this._unitOfWork.FriendsList.GetFriendsListByUserAndFriend(friend1.Id, friend2.Id);
            if (friendsList == null)
                return false;
            return true;
        }

        public async Task CreateFriendship(int requestId)
        {
            var request = await this._unitOfWork.Friendrequest.GetRequestById(requestId);
            if (request != null)
            {
                var friendsList = await this._unitOfWork.FriendsList.GetFriendsListByUserAndFriend(request.SenderId, request.RecipientId);
                if (friendsList == null)
                {
                    var friendslistCreated1 = new FriendsList(request.SenderId, request.RecipientId);
                    var friendslistCreated2 = new FriendsList(request.RecipientId, request.SenderId);
                    await _unitOfWork.FriendsList.AddAsync(friendslistCreated1);
                    await _unitOfWork.FriendsList.AddAsync(friendslistCreated2);
                    await _unitOfWork.Save();
                }
            }
        }

        public async Task<List<FriendsList>> GetAllFriendsForUser(int UserId)
        {
            List<FriendsList> friends = await this._unitOfWork.FriendsList.GetFriendsListByUser(UserId);
            return friends;
        }
    }
}
