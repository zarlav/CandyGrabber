using CandyGrabberApi.Domain;
using CandyGrabberApi.Domain.Enums;

namespace CandyGrabberApi.Models
{
    public class FriendRequestModel
    {
        public int Id { get; set; }
        public int RecipientId { get; set; }
        public UserModel? Recipient { get; set; }
        public int SenderId { get; set; }
        public UserModel? Sender { get; set; }
        public DateTime TimeStamp { get; set; }
        public FriendRequestStatus Status { get; set; }
    }
}
