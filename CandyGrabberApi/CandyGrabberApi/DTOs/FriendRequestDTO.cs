using CandyGrabberApi.Domain.Enums;

namespace CandyGrabberApi.DTOs
{
    public class FriendRequestDTO
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public FriendRequestStatus RequestStatus { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
