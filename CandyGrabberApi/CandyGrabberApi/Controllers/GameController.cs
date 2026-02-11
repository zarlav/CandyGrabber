using CandyGrabberApi.Domain;
using CandyGrabberApi.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyGrabberApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class GameController : ControllerBase
    {
        private readonly CandyGrabberContext _db;
        public IGameService _gameService;
        public IPlayerService _playerService;
        public GameController(CandyGrabberContext db, IGameService gameService, IPlayerService playerService)
        {
            this._db = db;
            _gameService = gameService;
            _playerService = playerService;
        }

        [Route("CreateGame/{HostId}")]
        [HttpPost]
        public async Task<IActionResult> CreateGame(int HostId, int duration)
        {
            try
            {
                Game game = await this._gameService.CreateGame(duration);

                Player player = await this._playerService.CreatePlayer(HostId, game.Id);

                player.Game = game;

                return Ok(player);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
