using CandyGrabberApi.DataContext;
using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;

namespace CandyGrabberApi.Repository
{
    public class WinnerRepository : Repository<Winner>, IWinnerRepository
    {
        private readonly CandyGrabberContext _db;

        public WinnerRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;
        }
    }
}
