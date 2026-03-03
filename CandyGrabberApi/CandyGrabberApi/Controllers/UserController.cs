using CandyGrabberApi.DTOs.UserDTO;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyGrabberApi.Controllers
{
  //  [Authorize]
    [Route("User")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly CandyGrabberContext _db;
        private readonly IUnitOfWork _unitOfWork;
        public IUserService _userService { get; set; }

        public UserController(CandyGrabberContext db, IUserService userService, IUnitOfWork unitOfWork)
        {
            _db = db;
            _userService = userService;
            _unitOfWork = unitOfWork;
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
        public async Task<IActionResult> Login([FromBody] UserLoginDTO userDto)
        {
            try
            {
                var token = await _userService.Login(userDto.Username, userDto.Password);

                var user = (await _unitOfWork.User
                    .FindAsync(u => u.Username == userDto.Username))
                    .FirstOrDefault();

                Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = false,
                    SameSite = SameSiteMode.None
                });

                return Ok(new
                {
                    Id = user.Id,
                    Username = user.Username,
                    Token = token
                });
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
        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            var jwt = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(jwt))
                return Ok(null); 

            try
            {
                var user = await _userService.GetUser(jwt);
                return Ok(user);
            }
            catch
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
        [AllowAnonymous]
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
        [AllowAnonymous]
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
