namespace CandyGrabberApi.Domain
{
    public class ChatMessage
    {
        private readonly object _lock = new();
        public int Id { get; private set; }
        public User Sender { get; private set; }
        public int SenderId { get; private set; }
        public User Recipient { get;private set; }
        public int RecipientId { get; private set; }
        public string Content { get; private set; }
        public DateTime TimeStamp { get; private set; }

        public ChatMessage(User _Sender, User _Recipient,string _Content)
        {
            Sender = _Sender ?? throw new ArgumentNullException(nameof(_Sender));
            Recipient = _Recipient ?? throw new ArgumentNullException(nameof(_Recipient));
            SenderId = Sender.Id;
            RecipientId = Recipient.Id;
            Content = _Content;
            TimeStamp = DateTime.UtcNow;
        }
        public void SetContent(string _Content)
        {
            if (string.IsNullOrEmpty(_Content))
                    throw new ArgumentException("Poruka ne moze biti prazna.", nameof(_Content));
            lock (_lock)
            {
                Content = _Content;
            }          
        }
    }
}
