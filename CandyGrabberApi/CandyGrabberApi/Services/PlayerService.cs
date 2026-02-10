using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.Services.IServices;

namespace CandyGrabberApi.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly IPlayerItemRepository _playerItemRepository;
        private readonly IGameItemService _gameItemService;
        private readonly ICandyRepository _candyRepository;
        private readonly IUserRepository _userRepository;
        private readonly IGameRepository _gameRepository;

        public PlayerService(
            IPlayerRepository playerRepository,
            IPlayerItemRepository playerItemRepository,
            IGameItemService gameItemService,
            ICandyRepository candyRepository,
            IUserRepository userRepository,
            IGameRepository gameRepository)
        {
            _playerRepository = playerRepository;
            _playerItemRepository = playerItemRepository;
            _gameItemService = gameItemService;
            _candyRepository = candyRepository;
            _userRepository = userRepository;
            _gameRepository = gameRepository;
        }

        public async Task<Player?> GetPlayerByIdAsync(int playerId)
        {
            return await _playerRepository.GetOne(playerId);
        }

        public async Task<IEnumerable<Player>> GetPlayersByGameAsync(int gameId)
        {
            var players = _playerRepository.Find(p => p.Game.Id == gameId);
            return players.ToList();
        }

        public async Task<Player> CreatePlayer(int userId, int gameId)
        {
            var user = await _userRepository.GetUserById(userId);
            var game = await _gameRepository.GetOne(gameId); 

            if (user == null || game == null)
                throw new Exception("User or Game not found");

            var player = new Player
            {
                User = user,
                Game = game
            };

            await _playerRepository.Add(player);

            return player;
        }

        public async Task<bool> CollectItemAsync(int playerId, int gameItemId)
        {
            var player = await _playerRepository.GetOne(playerId);
            var gameItem = await _gameItemService.GetGameItemByIdAsync(gameItemId);

            if (player == null || gameItem == null || gameItem.IsCollected)
                return false;

            var success = await _gameItemService.MarkItemAsCollectedAsync(gameItemId);
            if (!success) return false;

            player.AddToInventory(gameItem.Item, 1);

            _playerRepository.Update(player);

            return true;
        }

        public async Task<IEnumerable<PlayerItem>> GetPlayerInventoryAsync(int playerId)
        {
            var items = _playerItemRepository.Find(pi => pi.Player.Id == playerId);
            return items.ToList();
        }

        public async Task<bool> UsePowerUpAsync(int playerId, int playerItemId)
        {
            var playerItem = await _playerItemRepository.GetOne(playerItemId);

            if (playerItem == null || playerItem.Player.Id != playerId || playerItem.IsActive)
                return false;

            playerItem.Activate();
            _playerItemRepository.Update(playerItem);

            return true;
        }
    }
}