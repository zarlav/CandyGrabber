using CandyGrabberApi.DataContext;
using CandyGrabberApi.Domain;
using CandyGrabberApi.Domain.Enums;
using CandyGrabberApi.DTOs;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;
using System.Linq.Expressions;

namespace CandyGrabberApi.Services
{
    public class FriendRequestService : IFriendRequestService
    {
        private readonly CandyGrabberContext _db;
        public IUnitOfWork _unitOfWork { get; set; }

        public FriendRequestService(CandyGrabberContext db, IUnitOfWork unitOfWork)
        {
            this._db = db;
            this._unitOfWork = unitOfWork;
        }

        public async Task SendFriendRequest(FriendRequestDTO request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));
            var sender = await _unitOfWork.User.GetByIdAsync(request.SenderId);
            var recipient = await _unitOfWork.User.GetByIdAsync(request.RecipientId);

            if (sender == null || recipient == null)
                throw new Exception("Sender or Recipient not found.");
            var requestFound = await _unitOfWork.Friendrequest
                .GetRequestBySenderAndRecipient(sender.Id, recipient.Id);

            if (requestFound != null)
                throw new Exception("Friend request already sent.");
            var requestCreated = new FriendRequest(sender, recipient, request.Timestamp);
            requestCreated.SetStatusSent();
            await _unitOfWork.Friendrequest.AddAsync(requestCreated);
            await _unitOfWork.Save();
        }

        public async Task AcceptFriendRequest(int requestId)
        {
            var request = await this._unitOfWork.Friendrequest.GetRequestById(requestId);
            if (request == null)
            {
                throw new Exception("No such friend request");
            }
            request.SetStatusAccepted();
            _unitOfWork.Friendrequest.Update(request);
            await _unitOfWork.Save();
        }

        public async Task DeclineFriendRequest(int requestId)
        {
            var request = await this._unitOfWork.Friendrequest.GetRequestById(requestId);
            if (request == null)
            {
                throw new Exception("No such friend request");
            }
            _unitOfWork.Friendrequest.Delete(request);
            await _unitOfWork.Save();
        }

        public async Task<List<FriendRequest>> GetAllFriendRequestsForUser(int UserId)
        {
            return await _unitOfWork.Friendrequest.GetFriendRequestsByUser(UserId);
        }

        public async Task<bool> CheckIfFriendRequestSent(string UserName, string FriendName)
        {
            var friend1 = await this._unitOfWork.User.GetUserByUsername(UserName);
            var friend2 = await this._unitOfWork.User.GetUserByUsername(FriendName);
            if (friend1 == null || friend2 == null)
            {
                return false;
            }
            var friendsList = await this._unitOfWork.Friendrequest.GetRequestBySenderAndRecipient(friend1.Id, friend2.Id);
            if (friendsList == null)
                return false;
            return true;
        }
    }
}
