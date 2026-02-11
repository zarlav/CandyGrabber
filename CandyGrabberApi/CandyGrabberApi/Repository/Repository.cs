using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CandyGrabberApi.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly DbContext _context;

        public Repository(DbContext context)
        {
            _context = context;
        }

        public async Task<T> GetOne(int id)
        {
            var obj = await _context.Set<T>().FindAsync(id);
            if (obj == null)
            {
                throw new Exception($"Object of type {typeof(T).Name} with ID {id} does not exist.");
            }
            return obj;
        }

        public async Task<IQueryable<T>> GetAll()
        {
            return await Task.FromResult(_context.Set<T>().AsQueryable());
        }

        public virtual IQueryable<T> Find(Expression<Func<T, bool>> predicate)
        {
            return _context.Set<T>().Where(predicate);
        }

        public async Task Add(T obj)
        {
            await _context.Set<T>().AddAsync(obj);
        }

        public void Delete(T obj)
        {
            _context.Set<T>().Remove(obj);
        }

        public void Update(T obj)
        {
            _context.Set<T>().Update(obj);
        }
    }
}