using CandyGrabberApi.Domain.Enums;
using System.Reflection;

namespace CandyGrabberApi.Domain
{
    public class FriendRequest
    {
        private readonly object _state = new();
        public int Id { get; protected set; }
        public int RecipientId { get; protected set; }
        public User Recipient { get; protected set; } 
        public int SenderId { get; protected set; }
        public User Sender { get; protected set; }
        public DateTime TimeStamp { get; set; }
        public FriendRequestStatus Status { get; private set; }

        protected FriendRequest() { }
        public FriendRequest(User _Sender, User _Recipient, DateTime _TimeStamp)
        {
            Sender = _Sender ?? throw new ArgumentNullException(nameof(_Sender));
            Recipient = _Recipient ?? throw new ArgumentNullException(nameof(_Recipient));
            RecipientId = Recipient.Id;
            SenderId = Sender.Id;
            TimeStamp = _TimeStamp;
            Status = FriendRequestStatus.NONE;
        }
        public void  SetStatusAccepted()
        {
            lock (_state)
            {
                if (Status == FriendRequestStatus.SENT)
                {
                    Status = FriendRequestStatus.ACCEPTED;
                }
            }
        }
        public void SetStatusDeclined()
        {
            lock (_state)
            {
                if (Status == FriendRequestStatus.SENT)
                {
                    Status = FriendRequestStatus.DECLINED;
                }
            }
        }
        public void SetStatusSent()
        {
            lock (_state)
            {
                if (Status == FriendRequestStatus.NONE)
                {
                    Status = FriendRequestStatus.SENT;
                }
            }
        }
    }
}
