using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Models
{
    public class ChatMessageModel
    {
        public int Id { get; set; }
        public UserModel? Sender { get; set; }
        public int SenderId { get; set; }
        public UserModel? Recipient { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; } = String.Empty;
        public DateTime TimeStamp { get; set; }
    }
}
