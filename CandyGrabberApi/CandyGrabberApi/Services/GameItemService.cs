using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.Services.IServices;

namespace CandyGrabberApi.Services
{
    public class GameItemService : IGameItemService
    {
        private readonly IGameItemRepository _gameItemRepository;
        private readonly IItemRepository _itemRepository;
        private readonly IGameRepository _gameRepository;


        public GameItemService(IGameItemRepository gameItemRepository, IItemRepository itemRepository, IGameRepository gameRepository)
        {
            _gameItemRepository = gameItemRepository;
            _itemRepository = itemRepository;
            _gameRepository = gameRepository;
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
            var gameItem = await _gameItemRepository.GetByIdAsync(gameItemId);

            if (gameItem == null || gameItem.IsCollected) return false;

            gameItem.Collect();
            _gameItemRepository.Update(gameItem);

            return true;
        }

        public async Task SpawnItemsForGameAsync(int gameId)
        {
            var game = await _gameRepository.GetByIdAsync(gameId);
            if (game == null)
                throw new Exception("Game not found");

  
            var definitions = await _itemRepository.GetAllAsync();
            foreach (var definition in definitions)
            {
                game.AddGameItem(definition);
            }
            _gameRepository.Update(game);
        }
    }
}