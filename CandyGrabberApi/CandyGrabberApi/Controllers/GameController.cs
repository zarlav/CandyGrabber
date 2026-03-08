using CandyGrabberApi.Domain;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Xml;

namespace CandyGrabberApi.Controllers
{
 //   [Authorize]
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

        [HttpPost("CreateGame")]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameDTO dto)
        {
            try
            {
                Game game = await this._gameService.CreateGame(dto.Duration);
                Player player = await this._playerService.CreatePlayer(dto.HostId, game.Id);

                var playerDto = new PlayerDTO
                {
                    UserId = player.UserId,
                    Username = player.User.Username,
                    GameId = player.GameId
                };

                return Ok(playerDto);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPost("JoinGame")]
        public async Task<IActionResult> JoinGame(int gameId, int userId)
        {
            try
            {
                Player player = await _playerService.CreatePlayer(userId, gameId);

                var dto = new PlayerDTO
                {
                    UserId = player.UserId,
                    Username = player.User.Username,
                    GameId = player.GameId
                };

                return Ok(dto);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
