using LinguaFlow.Application.Interfaces;
using LinguaFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace LinguaFlow.Infrastructure;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _dbContext;
    private IDbContextTransaction? _transaction;
    public UnitOfWork(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public Task<int> SaveChangesAsync(CancellationToken ct)
        => _dbContext.SaveChangesAsync(ct);
}