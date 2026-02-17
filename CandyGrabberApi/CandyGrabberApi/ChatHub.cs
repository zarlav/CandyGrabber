using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;
using Microsoft.AspNetCore.SignalR;

namespace CandyGrabberApi
{
    public class ChatHub : Hub
    {
        private readonly IUserService _userService;
        private readonly IChatMessagesService _messageService;
        private readonly IWinnerService _winnerService;
        private readonly IFriendRequestService _requestService;
        private readonly IFriendsListService _friendsListService;
        private readonly IGameRequestServices _gameRequestService;

        public ChatHub(
            IUserService userService,
            IChatMessagesService messageService,
            IWinnerService winnerService,
            IFriendRequestService requestService,
            IFriendsListService friendsListService,
            IGameRequestServices gameRequestService)
        {
            _userService = userService;
            _messageService = messageService;
            _winnerService = winnerService;
            _requestService = requestService;
            _friendsListService = friendsListService;
            _gameRequestService = gameRequestService;
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

        public async Task SendMessageToUser(string recipient, string sender, string content)
        {
            var senderUser = await _userService.GetUserByUsername(sender);
            var recipientUser = await _userService.GetUserByUsername(recipient);

            if (senderUser != null && recipientUser != null)
            {
                var dto = new ChatMessagesDTO(senderUser.Id, recipientUser.Id, content, DateTime.UtcNow);
                await _messageService.SendMessage(dto);
                await Clients.Group(recipient).SendAsync("ReceiveMessage", sender, content);
            }
        }

        public async Task SendFriendRequest(string username, string friendUsername)
        {
            var user1 = await _userService.GetUserByUsername(username);
            var user2 = await _userService.GetUserByUsername(friendUsername);

            if (user1 != null && user2 != null)
            {
                var request = new FriendRequestDTO { SenderId = user1.Id, RecipientId = user2.Id, Timestamp = DateTime.UtcNow };
                await _requestService.SendFriendRequest(request);
                await Clients.Group(friendUsername).SendAsync("FriendRequestSent", username);
            }
        }
    }
}