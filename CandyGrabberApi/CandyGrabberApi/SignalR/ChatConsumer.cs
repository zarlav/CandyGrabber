using Microsoft.AspNetCore.SignalR;
using RabbitMQ.Client;
using Microsoft.Extensions.Hosting;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using CandyGrabberApi.DTOs;
using CandyGrabberApi.Services.IServices;
namespace CandyGrabberApi.SignalR
{
    public class ChatConsumer : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatConsumer(
            IServiceScopeFactory scopeFactory,
            IHubContext<ChatHub> hubContext)
        {
            _scopeFactory = scopeFactory;
            _hubContext = hubContext;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var factory = new ConnectionFactory() { HostName = "localhost" };
            var connection = factory.CreateConnection();
            var channel = connection.CreateModel();

            channel.ExchangeDeclare("candy_exchange", ExchangeType.Topic, true);

            channel.QueueDeclare("chat_queue", durable: true,
                exclusive: false, autoDelete: false);

            channel.QueueBind(
                "chat_queue",
                "candy_exchange",
                "chat.message.created"
            );

            var consumer = new EventingBasicConsumer(channel);

            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                var evt = JsonSerializer.Deserialize<ChatMessageEvent>(message);

                using var scope = _scopeFactory.CreateScope();
                var messageService =
                    scope.ServiceProvider.GetRequiredService<IChatMessagesService>();

                var userService =
                    scope.ServiceProvider.GetRequiredService<IUserService>();

                var senderUser =
                    await userService.GetUserByUsername(evt.Sender);

                var recipientUser =
                    await userService.GetUserByUsername(evt.Recipient);

                if (senderUser != null && recipientUser != null)
                {
                    var dto = new ChatMessagesDTO(
                        senderUser.Id,
                        recipientUser.Id,
                        evt.Content,
                        evt.Timestamp
                    );

                    await messageService.SendMessage(dto);

                    await _hubContext.Clients
                    .Group(evt.Recipient)
                    .SendAsync("ReceiveMessage", new
                    {
                        senderUsername = evt.Sender,
                        content = evt.Content
                     });
                }
            };

            channel.BasicConsume("chat_queue", true, consumer);

            return Task.CompletedTask;
        }
    }
}
