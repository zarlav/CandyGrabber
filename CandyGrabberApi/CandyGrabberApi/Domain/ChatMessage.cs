namespace CandyGrabberApi.Domain
{
    public class ChatMessage
    {
        private readonly object _lock = new();
        public int Id { get; private set; }
        public User Sender { get;  set; }
        public int SenderId { get;  set; }
        public User Recipient { get; set; }
        public int RecipientId { get;  set; }
        public string Content { get;  set; }
        public DateTime TimeStamp { get;  set; }

        public ChatMessage() { }
        public ChatMessage(int senderId,int recipientId, string content)
        {
            SenderId = senderId;
            RecipientId = recipientId;
            Content = content;
            TimeStamp = DateTime.UtcNow;
        }
        public void SetContent(string content)
        {
            if (string.IsNullOrEmpty(content))
                    throw new ArgumentException("Poruka ne moze biti prazna.", nameof(content));
            lock (_lock)
            {
                Content = content;
            }          
        }
    }
}
