using CandyGrabberApi.Domain.Enums;
using System.Text.Json.Serialization;

namespace CandyGrabberApi.DTOs
{
    public class FriendRequestDTO
    {
        [JsonIgnore]
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public FriendRequestStatus RequestStatus { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
