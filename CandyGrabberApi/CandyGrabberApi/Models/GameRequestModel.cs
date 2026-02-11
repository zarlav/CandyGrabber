using CandyGrabberApi.Domain;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CandyGrabberApi.Models
{
    public class GameRequestModel
    {
        public int Id { get; set; }
        public UserModel? Sender { get; set; }
        public int SenderId { get; set; }
        public UserModel? Recipient { get; set; }
        public int RecipientId { get; set; }
        public GameModel? Game { get; set; }
        public int GameId { get; set; }
        public DateTime TimeStamp { get; set; }
        public GameRequestModel(int senderId, int recipientId, int gameId, DateTime timestamp)
        {
            SenderId = senderId;
            RecipientId = recipientId;
            GameId = gameId;
            TimeStamp = timestamp;
        }
    }
}
