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
    public class FriendRequestController : ControllerBase
    {

        private readonly CandyGrabberContext _db;
        public IFriendRequestService _requestService { get; set; }
        public IFriendsListService _friendsListService { get; set; }
        public IUserService _userService { get; set; }

        public FriendRequestController(CandyGrabberContext db, IFriendRequestService requestService, IFriendsListService friendsListService, IUserService userService)
        {
            this._db = db;
            _requestService = requestService;
            _friendsListService = friendsListService;
            _userService = userService;
        }
        [Route("SendFriendRequest/{username}/{friendUsername}")]
        [HttpPost]
        public async Task<IActionResult> SendFriendRequest(string username, string friendUsername)
        {
            try
            {
                var friend1 = await this._userService.GetUserByUsername(username);
                var friend2 = await this._userService.GetUserByUsername(friendUsername);
                if (friend1 != null && friend2 != null)
                {

                    FriendRequestDTO request = new FriendRequestDTO
                    {
                        SenderId = friend1.Id,
                        RecipientId = friend2.Id,
                        Timestamp = DateTime.UtcNow
                    };
                    await this._requestService.SendFriendRequest(request);
                    return Ok(request);
                }
                else
                    return BadRequest();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("AcceptFriendRequest")]
        [HttpPost]
        public async Task<IActionResult> AcceptFriendRequest(int requestId)
        {
            try
            {
                await this._requestService.AcceptFriendRequest(requestId);
                await this._friendsListService.CreateFriendship(requestId);
                return Ok(requestId);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DeclineFriendRequest")]
        [HttpPost]
        public async Task<IActionResult> DeclineFriendRequest(int requestId)
        {
            try
            {
                await this._requestService.DeclineFriendRequest(requestId);

                return Ok(requestId);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("GetAllFriendRequests")]
        [HttpGet]
        public async Task<IActionResult> GetAllFriendRequests(string username)
        {
            var friend1 = await this._userService.GetUserByUsername(username);
            try
            {

                List<FriendRequest> requests = await this._requestService.GetAllFriendRequestsForUser(friend1.Id);
                foreach (FriendRequest req in requests)
                {
                    req.Sender = await this._userService.GetUserByUserId(req.SenderId);
                }
                return Ok(requests);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("CheckIfFriendRequestSent/{UserName}/{FriendName}")]
        [HttpGet]
        public async Task<IActionResult> CheckIfFriendRequestSent(string UserName, string FriendName)
        {
            try
            {
                bool friends = await this._requestService.CheckIfFriendRequestSent(UserName, FriendName);
                return Ok(friends);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
