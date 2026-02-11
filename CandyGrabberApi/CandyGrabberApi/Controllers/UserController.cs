using CandyGrabberApi.DataContext;
using CandyGrabberApi.DTOs.UserDTO;
using CandyGrabberApi.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyGrabberApi.Controllers
{
    [Authorize]
    [Route("User")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly CandyGrabberContext _db;
        public IUserService _userService { get; set; }

        public UserController(CandyGrabberContext db, IUserService userService)
        {
            _db = db;
            _userService = userService;
        }

        [AllowAnonymous]
        [Route("Register")]
        [HttpPost]
        public async Task<IActionResult> Register([FromForm] UserRegisterDTO user)
        {
            try
            {
                var result = await this._userService.Register(user);
                return Created("success", result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [AllowAnonymous]
        [Route("Login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO user)
        {
            try
            {
                var result = await this._userService.Login(user.Username, user.Password);

                Response.Cookies.Append("jwt", result, new CookieOptions { HttpOnly = false, Secure = true, SameSite = SameSiteMode.None });


                return Ok(new { message = "success" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("UpdateProfile")]
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromForm] UserUpdateDTO user)
        {
            try
            {
                await this._userService.UpdateProfile(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [AllowAnonymous]
        [Route("GetUser")]
        [HttpGet]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];

                var user = await this._userService.GetUser(jwt);

                return Ok(user);
            }
            catch (Exception e)
            {
                return Unauthorized();
            }
        }

        [Route("Logout")]
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            Response.Cookies.Delete("jwt", new CookieOptions { SameSite = SameSiteMode.None, Secure = true });

            return Ok(new { message = "success" });
        }

        [Route("Search/{username}/{ownerUsername}")]
        [HttpGet]
        public async Task<IActionResult> Search(string username, string ownerUsername)
        {
            try
            {
                var users = await this._userService.Search(username, ownerUsername);

                return Ok(users);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("GetUserByUsername/{username}")]
        [HttpGet]
        public async Task<IActionResult> GetUserByUsername(string username)
        {
            try
            {
                var users = await this._userService.GetUserByUsername(username);

                return Ok(users);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("Lose/{userId}")]
        [HttpPost]
        public async Task<IActionResult> Lose(int userId)
        {
            await this._userService.IncrementLose(userId);

            return Ok();
        }
    }
}
