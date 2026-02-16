using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;
using Microsoft.AspNetCore.SignalR;

namespace CandyGrabberApi
{
    public class ChatHub : Hub
    {
        private readonly IChatMessagesService _messageService;
        private readonly IUserService _userService;
        private readonly IWinnerService _winnerService;
        private readonly IFriendRequestService _requestService;
        private readonly IGameRequestServices _gameRequestService;
        private readonly IFriendsListService _friendsListService;
        private readonly IUnitOfWork _unitOfWork;

        public ChatHub(
            IChatMessagesService messageService,
            IUserService userService,
            IWinnerService winnerService,
            IFriendRequestService requestService,
            IGameRequestServices gameRequestService,
            IFriendsListService friendsListService,
            IUnitOfWork unitOfWork)
        {
            _messageService = messageService;
            _userService = userService;
            _winnerService = winnerService;
            _requestService = requestService;
            _gameRequestService = gameRequestService;
            _friendsListService = friendsListService;
            _unitOfWork = unitOfWork;
        }

        // Automatski dodavanje korisnika u grupu po username-u
        public override async Task OnConnectedAsync()
        {
            var username = Context.User?.Identity?.Name;
            if (!string.IsNullOrEmpty(username))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, username);
                await Clients.Caller.SendAsync("Connected", $"Connected as {username}");
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (exception != null)
                Console.WriteLine($"Disconnected: {exception.Message}");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string user, string message)
        {
            try
            {
                await Clients.All.SendAsync("ReceiveMessage", user, message);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task NewMessage(long username, string message)
        {
            try
            {
                await Clients.All.SendAsync("messageReceived", username, message);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task JoinGroup(string groupName)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                await Clients.Caller.SendAsync("JoinedGroup", groupName);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task LeaveGroup(string groupName)
        {
            try
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
                await Clients.Caller.SendAsync("LeftGroup", groupName);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task SendMessageToGroup(string groupName, string message)
        {
            try
            {
                var username = Context.User?.Identity?.Name ?? "Unknown";
                await Clients.Group(groupName).SendAsync("ReceiveMessage", username, message);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task SendMessageToUser(string recipient, string sender, ChatMessage message)
        {
            try
            {
                var senderUser = await _userService.GetUserByUsername(sender);
                var recipientUser = await _userService.GetUserByUsername(recipient);

                if (senderUser == null || recipientUser == null)
                {
                    await Clients.Caller.SendAsync("Error", "User not found");
                    return;
                }

                var dto = new ChatMessagesDTO(senderUser.Id, recipientUser.Id, message.Content, DateTime.UtcNow);
                await _messageService.SendMessage(dto);

                await Clients.Group(recipient).SendAsync("ReceiveMessage", sender, message);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task SendFriendRequest(string username, string friendUsername)
        {
            try
            {
                var user1 = await _userService.GetUserByUsername(username);
                var user2 = await _userService.GetUserByUsername(friendUsername);

                if (user1 == null || user2 == null)
                {
                    await Clients.Caller.SendAsync("Error", "User not found");
                    return;
                }

                var request = new FriendRequestDTO
                {
                    SenderId = user1.Id,
                    RecipientId = user2.Id,
                    Timestamp = DateTime.UtcNow
                };

                await _requestService.SendFriendRequest(request);
                await Clients.Group(friendUsername).SendAsync("FriendRequestSent", username);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task AcceptFriendRequest(int requestId, string username, string sender)
        {
            try
            {
                await _requestService.AcceptFriendRequest(requestId);
                await _friendsListService.CreateFriendship(requestId);

                await Clients.Group(username).SendAsync("FetchFriendRequests", sender);
                await Clients.Group(sender).SendAsync("FriendRequestAccepted", username);
                await Clients.Group(username).SendAsync("RefetchFriends", sender);
                await Clients.Group(sender).SendAsync("RefetchFriends", username);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task DeclineFriendRequest(int requestId, string username)
        {
            try
            {
                var request = await _unitOfWork.Friendrequest.GetRequestById(requestId);
                if (request != null)
                {
                    _unitOfWork.Friendrequest.Delete(request);
                    await Clients.Group(username).SendAsync("FetchFriendRequests", Context.User?.Identity?.Name);
                }
                else
                {
                    await Clients.Caller.SendAsync("Error", "Friend request not found");
                }
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task SendGameInviteToUser(string username, string friendname, GameRequestDTO gameRequest)
        {
            try
            {
                var gamereq = await _gameRequestService.SendGameRequest(gameRequest);
                if (gamereq != null)
                {
                    await Clients.Group(friendname).SendAsync("ReceiveGameInvite", username, gamereq);
                }
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task AcceptGameInviteToUser(User user, string friendname, int gameRequestId)
        {
            try
            {
                await Clients.Group(friendname).SendAsync("GameInviteAccepted", user);

                var player = await _gameRequestService.AcceptGameRequest(gameRequestId);
                await Clients.Group(user.Username).SendAsync("CreatedPlayer", player);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task DeclineGameInviteToUser(int gameRequestId)
        {
            try
            {
                await _gameRequestService.DeclineGameRequest(gameRequestId);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task StartGame(int gameId)
        {
            try
            {
                await Clients.Group($"game:{gameId}").SendAsync("GameStarted");
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task SendWinner(int gameId, int playerId)
        {
            try
            {
                await Clients.Group($"game:{gameId}").SendAsync("ReceiveWinner", playerId);
                await _winnerService.CreateWinner(playerId);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }
    }
}
