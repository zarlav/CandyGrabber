using CandyGrabberApi.Domain;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;

namespace CandyGrabberApi.Services
{
    public class WinnerService : IWinnerService
    {
        private readonly CandyGrabberContext _db;
        public IUnitOfWork _unitOfWork { get; set; }
        public IUserService _userService { get; set; }

        public WinnerService(CandyGrabberContext db, IUserService userService, IUnitOfWork unitOfWork)
        {
            this._db = db;
            this._unitOfWork = unitOfWork;
            this._userService = userService;
        }

        public async Task CreateWinner(int playerId)
        {
            var player = await this._unitOfWork.Player.GetByIdAsync(playerId);
            if (player == null)
            {
                throw new Exception("Player not exist!");
            }

            await this._userService.IncrementWins(player.UserId);

            var winner = new Winner(playerId);
            this._unitOfWork.Winner.AddAsync(winner);
            await this._unitOfWork.Save();
        }
    }
}
