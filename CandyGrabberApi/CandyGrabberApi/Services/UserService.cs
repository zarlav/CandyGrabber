using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs.UserDTO;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;

namespace CandyGrabberApi.Services
{ 
public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJWTservice _jwtService;

        public UserService(IUnitOfWork unitOfWork, IJWTservice jwtService)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
        }
        public async Task<User> Register(UserRegisterDTO dto)
        {
            var exists = await _unitOfWork.User.FindAsync(u => u.Username == dto.Username);
            if (exists.Any())
                throw new Exception("User with this username already exists.");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User(dto.Name, dto.LastName, dto.Username, passwordHash);

            await _unitOfWork.User.AddAsync(user);
            await _unitOfWork.Save();

            return user;
        }

        public async Task<string> Login(string username, string password)
        {
            var user = (await _unitOfWork.User
                .FindAsync(u => u.Username == username))
                .FirstOrDefault();

            if (user == null)
                throw new Exception("Invalid credentials");
            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            return _jwtService.GenerateToken(user.Id, user.Username);
        }


        public async Task UpdateProfile(UserUpdateDTO dto)
        {
            var user = await _unitOfWork.User.GetByIdAsync(dto.Id);
            if (user == null) throw new Exception("User not found");

            user.ChangeName(dto.Name);
            user.ChangeUserName(dto.Username);
            user.ChangeLastName(dto.LastName);
            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                user.ChangePassword(dto.NewPassword);
            }
            _unitOfWork.User.Update(user);
            await _unitOfWork.Save();
        }

        public async Task<User> GetUserByUserId(int userId)
        {
            return await _unitOfWork.User.GetByIdAsync(userId);
        }

        public async Task<User> GetUserByUsername(string username)
        {
            var user = (await _unitOfWork.User.FindAsync(u => u.Username == username)).FirstOrDefault();
            if (user == null) throw new Exception("User not found");
            return user;
        }

        public async Task<User> GetUser(string jwt)
        {
            var userId = _jwtService.GetUserIdFromToken(jwt);
            return await GetUserByUserId(userId);
        }
        public async Task<List<User>> Search(string username, string ownerUsername)
        {
            var owner = (await _unitOfWork.User.FindAsync(u => u.Username == ownerUsername)).FirstOrDefault();
            if (owner == null) throw new Exception("Owner not found");

            var users = await _unitOfWork.User.FindAsync(u => u.Username.Contains(username) && u.Id != owner.Id);
            return users;
        }

        public async Task<User> IncrementWins(int userId)
        {
            var user = await _unitOfWork.User.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            user.RegisterWin();
            _unitOfWork.User.Update(user);
            await _unitOfWork.Save();

            return user;
        }

        public async Task<User> IncrementLose(int userId)
        {
            var user = await _unitOfWork.User.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            user.RegisterLoss();
            _unitOfWork.User.Update(user);
            await _unitOfWork.Save();

            return user;
        }
    }
}
