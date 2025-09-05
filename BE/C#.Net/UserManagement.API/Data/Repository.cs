using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace UserManagement.API.Data;

public interface IRepository<T> where T : class
{
    IQueryable<T> GetAll();
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task<T?> FindByUsernameAsync(string username);
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
    Task SaveChangesAsync();
}

public class Repository<T> : IRepository<T> where T : class
{
    private readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public IQueryable<T> GetAll()
    {
        return _dbSet.AsQueryable();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.FirstOrDefaultAsync(predicate);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    /*
        This method could be moved to a more specific
        UserRepository class with a IUserRepository interface
        that could be injected to controllers usign structure map
        in the future.
    */
    public async Task<T?> FindByUsernameAsync(string username)
    {
        //For now this is only speccific for the user entity 
        //for the logic feature

        if (typeof(T) == typeof(Domain.User))
        {
            return await _dbSet.OfType<Domain.User>().FirstOrDefaultAsync(u => u.Username == username) as T;
        }
        return null;
    }



}
