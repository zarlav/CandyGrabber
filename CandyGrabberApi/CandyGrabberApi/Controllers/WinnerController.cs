using CandyGrabberApi.DataContext;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyGrabberApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WinnerController : ControllerBase
    {
        private readonly CandyGrabberContext _db;
        public IWinnerService _winnerService { get; set; }
        public WinnerController(CandyGrabberContext db, IWinnerService winnerService)
        {
            this._db = db;
            _winnerService = winnerService;
        }

        [Route("CreateWinner/{playerId}")]
        [HttpPost]
        public async Task<IActionResult> CreateWinner(int playerId)
        {
            try
            {
                await this._winnerService.CreateWinner(playerId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
