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

        public PlayerService(
            IPlayerRepository playerRepository,
            IPlayerItemRepository playerItemRepository,
            IGameItemService gameItemService,
            ICandyRepository candyRepository)
        {
            _playerRepository = playerRepository;
            _playerItemRepository = playerItemRepository;
            _gameItemService = gameItemService;
            _candyRepository = candyRepository;
        }

        public async Task<Player?> GetPlayerByIdAsync(int playerId)
        {
            return await _playerRepository.GetByIdAsync(playerId);
        }

        public async Task<IEnumerable<Player>> GetPlayersByGameAsync(int gameId)
        {
            return await _playerRepository.GetPlayersByGameIdAsync(gameId);
        }

        public async Task<bool> MovePlayerAsync(int playerId, int newX, int newY)
        {
            var player = await _playerRepository.GetByIdAsync(playerId);
            if (player == null) return false;

            player.UpdatePosition(newX, newY);

            var itemAtPos = await _gameItemService.GetItemAtPositionAsync(player.Game.Id, newX, newY);
            if (itemAtPos != null)
            {
                await CollectItemAsync(playerId, itemAtPos.Id);
            }

            _playerRepository.Update(player);
            await _playerRepository.SaveAsync();
            return true;
        }

        public async Task<bool> CollectItemAsync(int playerId, int gameItemId)
        {
            var player = await _playerRepository.GetByIdAsync(playerId);
            var gameItem = await _gameItemService.GetGameItemByIdAsync(gameItemId);

            if (player == null || gameItem == null || gameItem.IsCollected) return false;

            var success = await _gameItemService.MarkItemAsCollectedAsync(gameItemId);
            if (!success) return false;

            player.AddToInventory(gameItem.Item);

            var candyData = await _candyRepository.GetByItemIdAsync(gameItem.ItemId);
            if (candyData != null)
            {
                player.AddPoints(candyData.Points);
            }

            _playerRepository.Update(player);
            await _playerRepository.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<PlayerItem>> GetPlayerInventoryAsync(int playerId)
        {
            return await _playerItemRepository.GetByPlayerIdAsync(playerId);
        }

        public async Task<bool> UsePowerUpAsync(int playerId, int playerItemId)
        {
            var playerItem = await _playerItemRepository.GetByIdAsync(playerItemId);

            if (playerItem == null || playerItem.Player.Id != playerId || playerItem.IsActive)
                return false;

            playerItem.Activate();
            _playerItemRepository.Update(playerItem);
            await _playerItemRepository.SaveAsync();

            return true;
        }
    }
}