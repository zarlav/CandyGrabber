using CandyGrabberApi.DataContext;
using CandyGrabberApi.Domain;
using CandyGrabberApi.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyGrabberApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class FriendsListController : ControllerBase
    {
        private readonly CandyGrabberContext _db;
        public IFriendRequestService _friendRequestService { get; set; }
        public IFriendsListService _friendsListService { get; set; }
        public IUserService _userService { get; set; }
        public FriendsListController(CandyGrabberContext db, IFriendRequestService friendRequestService, IFriendsListService friendsListService, IUserService userService)
        {
            _db = db;
            _friendRequestService = friendRequestService;
            _friendsListService = friendsListService;
            _userService = userService;
        }

        [Route("GetAllFriends/{UserId}")]
        [HttpGet]
        public async Task<IActionResult> GetAllFriends(int UserId)
        {
            try
            {
                List<FriendsList> friends = await this._friendsListService.GetAllFriendsForUser(UserId);

                return Ok(friends);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("CheckIfFriends/{UserName}/{FriendName}")]
        [HttpGet]
        public async Task<IActionResult> CheckIfFriends(string UserName, string FriendName)
        {
            try
            {
                bool friends = await this._friendsListService.CheckIfFriends(UserName, FriendName);

                return Ok(friends);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
