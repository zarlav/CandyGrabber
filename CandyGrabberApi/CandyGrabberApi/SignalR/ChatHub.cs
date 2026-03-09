using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;
using CandyGrabberApi.Services;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;
using Microsoft.AspNetCore.SignalR;

namespace CandyGrabberApi.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IUserService _userService;
        private readonly IChatMessagesService _messageService;
        private readonly IFriendRequestService _requestService;
        private readonly IGameRequestServices _gameRequestService;
        private readonly IGameService _gameService;
        private readonly IPlayerService _playerService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly CandyGrabberContext _db;

        public ChatHub(
            IUserService userService,
            IChatMessagesService messageService,
            IFriendRequestService requestService,
            IGameService gameService,
            IPlayerService platerService,
            IGameRequestServices gameRequestService,
            IUnitOfWork unitOfWork,
            CandyGrabberContext db)
        {
            _userService = userService;
            _messageService = messageService;
            _requestService = requestService;
            _gameService = gameService;
            _playerService = platerService;
            _gameRequestService = gameRequestService;
            _unitOfWork = unitOfWork;
            _db = db;
        }

        public async Task EndGame(int gameId, int winnerUserId, int loserUserId)
        {
            var winner = (await _unitOfWork.User.FindAsync(u => u.Id == winnerUserId)).FirstOrDefault();
            if (winner != null)
            {
                winner.RegisterWin();
            }

            var loser = (await _unitOfWork.User.FindAsync(u => u.Id == loserUserId)).FirstOrDefault();
            if (loser != null)
            {
                loser.RegisterLoss();
            }

            await _db.SaveChangesAsync();
            await Clients.Group($"game_{gameId}").SendAsync("MatchFinished", winnerUserId);
        }

        public async Task SendMessageToUser(string recipientUsername, string senderUsername, string content)
        {
            if (string.IsNullOrWhiteSpace(content)) return;

            var senderUser = await _userService.GetUserByUsername(senderUsername);
            var recipientUser = await _userService.GetUserByUsername(recipientUsername);

            if (senderUser == null || recipientUser == null) return;

            var dto = new ChatMessagesDTO(senderUser.Id, recipientUser.Id, content, DateTime.UtcNow);
            await _messageService.SendMessage(dto);
        }

        public async Task SendGameRequestAccepted(int requestId, string senderUsername, string recipientUsername)
        {
            var senderUser = await _userService.GetUserByUsername(senderUsername);
            var recipientUser = await _userService.GetUserByUsername(recipientUsername);

            if (senderUser == null || recipientUser == null) return;

            Game game = await _gameService.CreateGame(120);
            Player hostPlayer = await _playerService.CreatePlayer(senderUser.Id, game.Id);
            Player guestPlayer = await _playerService.CreatePlayer(recipientUser.Id, game.Id);

            var gameStartDto = new GameStartDTO
            {
                GameId = game.Id,
                Player1 = new PlayerDTO { UserId = hostPlayer.UserId, Username = hostPlayer.User.Username, GameId = hostPlayer.GameId },
                Player2 = new PlayerDTO { UserId = guestPlayer.UserId, Username = guestPlayer.User.Username, GameId = guestPlayer.GameId }
            };

            await Clients.Group(senderUsername).SendAsync("GameStarted", gameStartDto);
            await Clients.Group(recipientUsername).SendAsync("GameStarted", gameStartDto);
        }

        public async Task PlayerMove(int gameId, int playerId, float x, float y)
        {
            await Clients.Group($"game_{gameId}").SendAsync("PlayerMoved", playerId, x, y);
        }

        public async Task PickItem(int gameId, int itemIndex)
        {
            await Clients.Group($"game_{gameId}").SendAsync("ItemPicked", itemIndex);
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

        public async Task SendGameRequest(string senderUsername, string recipientUsername)
        {
            var sender = await _userService.GetUserByUsername(senderUsername);
            var recipient = await _userService.GetUserByUsername(recipientUsername);

            if (sender == null || recipient == null) return;

            var requestDto = new GameRequestDTO { SenderId = sender.Id, RecipientId = recipient.Id, Timestamp = DateTime.UtcNow };
            await _gameRequestService.SendGameRequest(requestDto);

            await Clients.Group(recipientUsername).SendAsync("ReceiveGameRequest", new { senderId = sender.Id, username = sender.Username });
        }

        public async Task SendFriendRequest(string senderUsername, string recipientUsername)
        {
            var sender = await _userService.GetUserByUsername(senderUsername);
            var recipient = await _userService.GetUserByUsername(recipientUsername);

            if (sender == null || recipient == null) return;

            var request = new FriendRequestDTO { SenderId = sender.Id, RecipientId = recipient.Id, Timestamp = DateTime.UtcNow };
            await _requestService.SendFriendRequest(request);

            await Clients.Group(recipientUsername).SendAsync("FriendRequestSent", senderUsername);
        }
    }
}