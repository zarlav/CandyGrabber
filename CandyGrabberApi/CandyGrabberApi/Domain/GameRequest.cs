using CandyGrabberApi.Domain.Enums;
using System.Security.Cryptography.X509Certificates;

namespace CandyGrabberApi.Domain
{
    public class GameRequest
    {
        private readonly object _state = new();
        public int Id { get; protected set; }
        public User Sender { get;  set; }
        public int SenderId { get; set; }
        public User Recipient { get; set; }
        public int RecipientId { get; set; }
        public Game Game { get; set; }
        public int GameId { get; set; }
        public DateTime TimeStamp { get; set; }
        public GameRequestStatus GameRequestStatus { get; set; }
        public GameRequest(int senderId, int recipientId, int gameId, DateTime timeStamp)
        {
            SenderId = senderId;
            RecipientId = recipientId;
            GameId = gameId;
            TimeStamp = timeStamp;
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
