using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly IGameItemRepository _gameItemRepository;
        private readonly IPlayerItemRepository _playerItemRepository;
        private readonly IUserRepository _userRepository;
        private readonly IGameRepository _gameRepository;

        public PlayerService(
            IPlayerRepository playerRepository,
            IGameItemRepository gameItemRepository,
            IPlayerItemRepository playerItemRepository,
            IUserRepository userRepository,
            IGameRepository gameRepository)
        {
            _playerRepository = playerRepository;
            _gameItemRepository = gameItemRepository;
            _playerItemRepository = playerItemRepository;
            _userRepository = userRepository;
            _gameRepository = gameRepository;
        }

        public async Task<Player?> GetPlayerByIdAsync(int playerId)
        {
            return await _playerRepository.GetByIdWithUserAndGameAsync(playerId);
        }

        public async Task<IEnumerable<Player>> GetPlayersByGameAsync(int gameId)
        {
            return await _playerRepository.GetPlayersByGameIdAsync(gameId);
        }

        public async Task<Player> CreatePlayer(int userId, int gameId)
        {
            var user = await _userRepository.GetOne(userId);
            var game = await _gameRepository.GetOne(gameId);

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
            var player = await _playerRepository.GetPlayerWithItemsAsync(playerId);
            var gameItem = await _gameItemRepository.GetByIdWithItemAsync(gameItemId);

            if (player == null || gameItem == null || gameItem.IsCollected)
                return false;

            gameItem.Collect();
            player.AddToInventory(gameItem.Item, 1);

            _gameItemRepository.Update(gameItem);
            _playerRepository.Update(player);

            return true;
        }

        public async Task<IEnumerable<PlayerItem>> GetPlayerInventoryAsync(int playerId)
        {
            return await _playerItemRepository.GetByPlayerIdAsync(playerId);
        }

        public async Task<bool> UsePowerUpAsync(int playerId, int playerItemId)
        {
            var playerItem = await _playerItemRepository.GetByIdWithDetailsAsync(playerItemId);

            if (playerItem == null || playerItem.PlayerId != playerId || !playerItem.IsActive)
                return false;

            playerItem.Deactivate();

            _playerItemRepository.Update(playerItem);
            return true;
        }
    }
}