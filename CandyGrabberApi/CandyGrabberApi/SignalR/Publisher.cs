using Microsoft.EntityFrameworkCore.Metadata;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;
namespace CandyGrabberApi.SignalR
{
    public class Publisher : IPublisher
    {
        private readonly IConnection _connection;
        private readonly RabbitMQ.Client.IModel _channel;

        public Publisher()
        {
            var factory = new ConnectionFactory()
            {
                HostName = "localhost"
            };

            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            _channel.ExchangeDeclare(
                exchange: "candy_exchange",
                type: ExchangeType.Topic,
                durable: true
            );
        }
        public void Publish<T>(T message, string routingKey)
        {
            var body = Encoding.UTF8.GetBytes(
              JsonSerializer.Serialize(message)
          );

            _channel.BasicPublish(
                exchange: "candy_exchange",
                routingKey: routingKey,
                basicProperties: null,
                body: body
            );
        }
    }
}
