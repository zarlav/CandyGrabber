namespace CandyGrabberApi.DTOs
{
    public class ChatMessagesDTO
    {
        public int SenderId { get; init; }
        public int RecipientId { get; init; }
        public string Content { get; init; }
        public DateTime Timestamp { get; init; }

        public ChatMessagesDTO(int senderId, int recipientId, string content, DateTime timestamp)
        {
            this.SenderId = senderId;
            this.RecipientId = recipientId;
            this.Content = content;
            this.Timestamp = timestamp;
        }
    }
}
