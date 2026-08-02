using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Interfaces.Repository;

public interface IUserWordProgressRepository
{
    Task<UserWordProgress?> GetAsync(int userId, int wordId, CancellationToken ct);
    Task<List<UserWordProgress>> GetDueForReviewAsync(int userId, CancellationToken ct);
    Task AddAsync(UserWordProgress progress, CancellationToken ct);
    void Update(UserWordProgress progress);
    Task<List<int>> GetExistingWordIdsAsync(int userId, List<int> wordIds, CancellationToken ct);
    Task AddRangeAsync(List<UserWordProgress> items, CancellationToken ct);
}