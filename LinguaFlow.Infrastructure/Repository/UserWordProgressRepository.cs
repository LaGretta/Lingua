using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LinguaFlow.Infrastructure.Repository;

public class UserWordProgressRepository : IUserWordProgressRepository
{
    private readonly AppDbContext _dbContext;

    public UserWordProgressRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UserWordProgress?> GetAsync(int userId, int wordId, CancellationToken ct)
    {
        return await _dbContext.UserWordProgress
            .FirstOrDefaultAsync(p => p.UserId == userId && p.WordId == wordId, ct);
    }
    public async Task<List<UserWordProgress>> GetDueForReviewAsync(int userId, CancellationToken ct)
    {
        var today = DateTime.UtcNow.Date;
        return await _dbContext.UserWordProgress
            .Include(p => p.Word)
            .Where(p => p.UserId == userId && p.NextReviewDate <= today)
            .ToListAsync(ct);
    }
    public async Task AddAsync(UserWordProgress progress, CancellationToken ct)
    {
        await _dbContext.UserWordProgress.AddAsync(progress, ct);
    }
    public void Update(UserWordProgress progress)
    {
        _dbContext.UserWordProgress.Update(progress);
    }
    public async Task<List<int>> GetExistingWordIdsAsync(int userId, List<int> wordIds, CancellationToken ct)
    {
        return await _dbContext.UserWordProgress
            .Where(p => p.UserId == userId && wordIds.Contains(p.WordId))
            .Select(p => p.WordId)
            .ToListAsync(ct);
    }
    public async Task AddRangeAsync(List<UserWordProgress> items, CancellationToken ct)
    {
        await _dbContext.UserWordProgress.AddRangeAsync(items, ct);
    }
    public async Task<int> CountLearnedAsync(int userId, CancellationToken ct)
    {
        return await _dbContext.UserWordProgress
            .CountAsync(p => p.UserId == userId && p.IsLearned, ct);
    }
    public async Task<int> CountInProgressAsync(int userId, CancellationToken ct)
    {
        return await _dbContext.UserWordProgress
            .CountAsync(p => p.UserId == userId, ct);
    }
}