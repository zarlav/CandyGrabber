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
        public DateTime TimeStamp { get; set; }
        public GameRequestModel(int senderId, int recipientId, DateTime timestamp)
        {
            SenderId = senderId;
            RecipientId = recipientId;
            TimeStamp = timestamp;
        }
    }
}
