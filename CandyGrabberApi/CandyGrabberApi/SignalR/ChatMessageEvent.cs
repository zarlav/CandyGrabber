namespace CandyGrabberApi.SignalR
{
    public class ChatMessageEvent
    {
        public string Sender { get; set; }
        public string Recipient { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
