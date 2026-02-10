using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetUserByUsername(string username);
        Task<User?> GetUserById(int id);
        Task<User> Create(User user);
        Task<User> UpdateUser(User user);
        Task<List<User>> GetUsersByUsername(string username, string ownerUsername);
    }
}
