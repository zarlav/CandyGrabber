namespace CandyGrabberApi.SignalR
{
    public interface IPublisher
    {
        void Publish<T>(T message, string routingKey);
    }
}
