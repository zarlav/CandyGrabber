using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.Services.IServices;

namespace CandyGrabberApi.Services
{
    public class GameItemService : IGameItemService
    {
        private readonly IGameItemRepository _gameItemRepository;
        private readonly IItemRepository _itemRepository;

        public GameItemService(IGameItemRepository gameItemRepository, IItemRepository itemRepository)
        {
            _gameItemRepository = gameItemRepository;
            _itemRepository = itemRepository;
        }

        public async Task<IEnumerable<GameItem>> GetActiveItemsInGameAsync(int gameId)
        {
            return await _gameItemRepository.GetActiveItemsByGameIdAsync(gameId);
        }

        public async Task<GameItem?> GetGameItemByIdAsync(int id)
        {
            return await _gameItemRepository.GetByIdAsync(id);
        }

        public async Task<GameItem?> GetItemAtPositionAsync(int gameId, int x, int y)
        {
            var activeItems = await _gameItemRepository.GetActiveItemsByGameIdAsync(gameId);
            return activeItems.FirstOrDefault(gi => gi.X == x && gi.Y == y);
        }

        public async Task<bool> MarkItemAsCollectedAsync(int gameItemId)
        {
            var gameItem = await _gameItemRepository.GetByIdAsync(gameItemId);
            if (gameItem == null || gameItem.IsCollected) return false;

            gameItem.Collect();
            _gameItemRepository.Update(gameItem);
            await _gameItemRepository.SaveAsync();
            return true;
        }

        public async Task SpawnItemsForGameAsync(int gameId)
        {
            var allDefinitions = await _itemRepository.GetAllAsync();
            var random = new Random();

            foreach (var definition in allDefinitions)
            {
                var gameItem = new GameItem(
                    gameId,
                    definition.Id,
                    random.Next(0, 100),
                    random.Next(0, 100)
                );

                await _gameItemRepository.AddAsync(gameItem);
            }

            await _gameItemRepository.SaveAsync();
        }
    }
}