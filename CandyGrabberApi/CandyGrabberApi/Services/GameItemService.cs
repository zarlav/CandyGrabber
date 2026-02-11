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
            return await _gameItemRepository.GetByIdWithItemAsync(id);
        }

        public async Task<bool> MarkItemAsCollectedAsync(int gameItemId)
        {
            var gameItem = await _gameItemRepository.GetOne(gameItemId);

            if (gameItem == null || gameItem.IsCollected) return false;

            gameItem.Collect();
            _gameItemRepository.Update(gameItem);

            return true;
        }

        public async Task SpawnItemsForGameAsync(int gameId)
        {
            var allDefinitionsQuery = await _itemRepository.GetAll();
            var allDefinitions = allDefinitionsQuery.ToList();

            foreach (var definition in allDefinitions)
            {
                var gameItem = new GameItem
                {
                    GameId = gameId,
                    Item = definition,
                    SpawnTime = DateTime.UtcNow
                };

                await _gameItemRepository.Add(gameItem);
            }
        }
    }
}