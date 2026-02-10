using CandyGrabberApi.DataContext;
using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;

namespace CandyGrabberApi.Repository
{
    public class GameRepository : Repository<Game>, IGameRepository
    {
        private CandyGrabberContext _db;
        public GameRepository(CandyGrabberContext db) : base(db)
        {
            this._db = db;
        }
    }
}
