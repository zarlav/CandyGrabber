using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Repository
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private CandyGrabberContext _db;

        public UserRepository(CandyGrabberContext _db) : base(_db)
        {
            this._db = _db;
        }
        public async Task<User> GetUserByUsername(string username)
        {
            var user = await this._db.User.Where(x => x.Username == username).FirstOrDefaultAsync();
            return user;
        }
        public async Task<List<User>> GetUsersByUsername(string username, string ownerUsername)
        {
            return await _db.User
                .Where(u => u.Username.Contains(username) && u.Username != ownerUsername)
                .ToListAsync();
        }
        public async Task<User> UpdateUser(User user)
        {
            _db.User.Update(user);
            await _db.SaveChangesAsync();
            return user;
        }
        public async Task<User> GetUserById(int id)
        {
            var user = await _db.User.Where(x => x.Id == id).FirstOrDefaultAsync();
            return user;
        }
        public async Task<User> Create(User user)
        {
            _db.User.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }
    }
}
