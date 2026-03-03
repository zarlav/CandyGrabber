using CandyGrabberApi.DTOs;
using CandyGrabberApi.Services.IServices;
using Microsoft.AspNetCore.SignalR;

namespace CandyGrabberApi.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IUserService _userService;
        private readonly IChatMessagesService _messageService;
        private readonly IFriendRequestService _requestService;

        public ChatHub(
            IUserService userService,
            IChatMessagesService messageService,
            IFriendRequestService requestService)
        {
            _userService = userService;
            _messageService = messageService;
            _requestService = requestService;
        }

        public override async Task OnConnectedAsync()
        {
            var username = Context.GetHttpContext()?.Request.Query["username"].ToString();

            if (!string.IsNullOrEmpty(username))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, username);
            }

            await base.OnConnectedAsync();
        }
        public async Task SendMessageToUser(string recipientUsername, string senderUsername, string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                return;

            var senderUser = await _userService.GetUserByUsername(senderUsername);
            var recipientUser = await _userService.GetUserByUsername(recipientUsername);

            if (senderUser == null || recipientUser == null)
                return;

            var dto = new ChatMessagesDTO(
                senderUser.Id,
                recipientUser.Id,
                content,
                DateTime.UtcNow
            );

            await _messageService.SendMessage(dto);
        }
        public async Task SendFriendRequest(string senderUsername, string recipientUsername)
        {
            var sender = await _userService.GetUserByUsername(senderUsername);
            var recipient = await _userService.GetUserByUsername(recipientUsername);

            if (sender == null || recipient == null)
                return;

            var request = new FriendRequestDTO
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Timestamp = DateTime.UtcNow
            };

            await _requestService.SendFriendRequest(request);

            await Clients.Group(recipientUsername)
                .SendAsync("FriendRequestSent", senderUsername);
        }
    }
}