using CandyGrabberApi.CandyGrabberDbContext;

namespace CandyGrabberApi.Repository
{
    public class UserRepository
    {
        private CandyGrabberContext _db;

        public UserRepository(CandyGrabberContext _db) : base(_db)
        {
            this._db = _db;
        }


                

    }
}
