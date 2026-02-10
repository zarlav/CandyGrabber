using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.Services.IServices;

namespace CandyGrabberApi.Services
{
    public class GameService : IGameService
    {
        private readonly IGameRepository _gameRepository;
        private readonly IPlayerRepository _playerRepository;
        private readonly IGameItemService _gameItemService;

        public GameService(
            IGameRepository gameRepository,
            IPlayerRepository playerRepository,
            IGameItemService gameItemService)
        {
            _gameRepository = gameRepository;
            _playerRepository = playerRepository;
            _gameItemService = gameItemService;
        }

        public async Task<Game?> CreateGameAsync(string gameName, int maxPlayers)
        {
            var game = new Game(gameName, maxPlayers);
            await _gameRepository.AddAsync(game);
            await _gameRepository.SaveAsync();
            return game;
        }

        public async Task<bool> StartGameAsync(int gameId)
        {
            var game = await _gameRepository.GetByIdAsync(gameId);
            if (game == null) return false;

            game.Start();
            await _gameItemService.SpawnItemsForGameAsync(gameId);

            _gameRepository.Update(game);
            await _gameRepository.SaveAsync();
            return true;
        }

        public async Task<bool> EndGameAsync(int gameId)
        {
            var game = await _gameRepository.GetByIdAsync(gameId);
            if (game == null) return false;

            game.End();
            _gameRepository.Update(game);
            await _gameRepository.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<Game>> GetActiveGamesAsync()
        {
            var games = await _gameRepository.GetAllAsync();
            return games.Where(g => g.Status == "Active");
        }

        public async Task<Player?> GetWinnerAsync(int gameId)
        {
            var players = await _playerRepository.GetPlayersByGameIdAsync(gameId);
            return players.OrderByDescending(p => p.Points).FirstOrDefault();
        }
    }
}