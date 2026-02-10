using CandyGrabberApi.Domain.Enums;
using System.Security.Cryptography.X509Certificates;

namespace CandyGrabberApi.Domain
{
    public class GameRequest
    {
        private readonly object _state = new();
        public int Id { get; protected set; }
        public User Sender { get; protected set; }
        public int SenderId { get;protected set; }
        public User Recipient { get;protected set; }
        public int RecipientId { get;protected set; }
        public Game Game { get;protected set; }
        public int GameId { get;protected set; }
        public DateTime TimeStamp { get; set; }
        public GameRequestStatus GameRequestStatus { get; set; }
        public GameRequest(int senderId, int recipientId, int gameId, DateTime _TimeStamp)
        {
            SenderId = senderId;
            RecipientId = recipientId;
            GameId = gameId;
            TimeStamp = _TimeStamp;
            GameRequestStatus = GameRequestStatus.NONE;
        }

        public void SetGameRequestStatusToSent()
        {
            lock (_state)
            {
                if (GameRequestStatus == GameRequestStatus.NONE)
                    GameRequestStatus = GameRequestStatus.SENT;
            }
        }
        public void SetGameRequestStatusToDeclined()
        {
            lock (_state)
            {
                if (GameRequestStatus == GameRequestStatus.SENT)
                    GameRequestStatus = GameRequestStatus.DECLINED;
            }
        }
        public void SetGameRequestStatusToAccepted()
        {
            lock (_state)
            {
                if (GameRequestStatus == GameRequestStatus.SENT)
                    GameRequestStatus = GameRequestStatus.ACCEPTED;
            }
        }

    }
}
