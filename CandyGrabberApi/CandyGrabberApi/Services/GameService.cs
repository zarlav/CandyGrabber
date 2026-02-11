using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;

namespace CandyGrabberApi.Services
{
    public class GameService : IGameService
    {
        private readonly IUnitOfWork _unitOfWork;

        public GameService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Game> CreateGame(int duration)
        {
            var game = new Game(duration);

            var items = await _unitOfWork.Item.GetAllAsync();

            game.GenerateItems(items);
            await _unitOfWork.Game.AddAsync(game);
            await _unitOfWork.Save();
            return game;
        }
    }
}
