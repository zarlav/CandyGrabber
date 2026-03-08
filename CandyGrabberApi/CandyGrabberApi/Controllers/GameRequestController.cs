using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;
using CandyGrabberApi.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyGrabberApi.Controllers
{
  //  [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class GameRequestController : ControllerBase
    {
        private readonly CandyGrabberContext _db;
        public IGameRequestServices _gameRequestService;
        public GameRequestController(CandyGrabberContext db, IGameRequestServices gameRequestService)
        {
            this._db = db;
            _gameRequestService = gameRequestService;
        }
        [Route("SendGameRequest")]
        [HttpPost]
        public async Task<IActionResult> SendGameRequest([FromBody] GameRequestDTO request)
        {
            try
            {
                await this._gameRequestService.SendGameRequest(request);
                return Ok(request);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPut("AcceptGameRequest/{requestId}")]
        public async Task<IActionResult> AcceptGameRequest(int requestId)
        {
            try
            {
                Player player = await _gameRequestService.AcceptGameRequest(requestId);

                var playerDto = new PlayerDTO
                {
                    Id = player.Id,
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
        //[Route("DeleteGameRequest/{requestId}")]
        //[HttpDelete]
        //public async Task<IActionResult> DeleteGameRequest(int requestId)
        //{
        //    try
        //    {
        //        await this._gameRequestService.DeleteGameRequests(requestId);
        //        return Ok();
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //}
        [Route("DeclineGameRequest/{requestId}")]
        [HttpDelete]
        public async Task<IActionResult> DeclineGameRequest(int requestId)
        {
            try
            {
                await this._gameRequestService.DeclineGameRequest(requestId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("GetAllGameRequestByRecipientId/{recipientId}")]
        [HttpGet]
        public async Task<IActionResult> GetAllGameRequestByRecipientId(int recipientId)
        {
            try
            {
                var gameRequestList = await this._gameRequestService.GetAllGameRequestByRecipientId(recipientId);
                return Ok(gameRequestList);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
