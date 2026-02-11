using CandyGrabberApi.DataContext;
using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Repository
{
    public class CandyRepository : Repository<Candy>, ICandyRepository
    {
        private readonly CandyGrabberContext _candyContext;

        public CandyRepository(CandyGrabberContext context) : base(context)
        {
            _candyContext = context;
        }

        public async Task<Candy?> GetByItemIdAsync(int itemId)
        {
            return await _candyContext.Candies.FirstOrDefaultAsync(c => c.ItemId == itemId);
        }
    }
}