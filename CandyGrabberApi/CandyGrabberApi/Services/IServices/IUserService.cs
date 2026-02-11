using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs.UserDTO;

namespace CandyGrabberApi.Services.IServices
{
    public interface IUserService
    {
        Task<User> Register(UserRegisterDTO user);
        Task<string> Login(string email, string password);
        Task UpdateProfile(UserUpdateDTO user);
        Task<User> GetUserByUserId(int userId);
        Task<User> GetUser(string jwt);
        Task<User> GetUserByUsername(string username);
        Task<List<User>> Search(string username, string ownerUsername);
        Task<User> IncrementWins(int userId);
        Task<User> IncrementLose(int userId);
    }
}
