using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LinguaFlow.Infrastructure.Repository;

public class AuthRepository : IAuthRepository
{
    private readonly AppDbContext _dbContext;
    public AuthRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> GetUserByEmailAsync(string email, CancellationToken ct)
    {
        var get = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email, ct);
        return get;
    }

    public async Task<bool> ExistsUserByEmailAsync(string email, CancellationToken ct)
    {
        var get = await _dbContext.Users.AnyAsync(u => u.Email == email, ct);
        return get;
    }

    public async Task CreateUserAsync(User user, CancellationToken ct)
    {
        await _dbContext.Users.AddAsync(user, ct);
    }
}