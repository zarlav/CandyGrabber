using CandyGrabberApi.Domain.Enums;

namespace CandyGrabberApi.DTOs
{
    public class GameRequestDTO
    {
        public int SenderId { get; init; }
        public int RecipientId { get; init; }
        public int GameId { get; init; }
       // public GameRequestStatus RequestStatus { get; init; }
        public DateTime Timestamp { get; init; } = DateTime.Now;
    }
}
