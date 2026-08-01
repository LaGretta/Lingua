using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LinguaFlow.Infrastructure.Repository;

public class WordRepository : IWordsRepository
{
    private readonly AppDbContext _dbContext;

    public WordRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Word?> GetWordByIdAsync(int id, CancellationToken ct)
    {
        return await _dbContext.Words.FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task CreateWordAsync(Word word, CancellationToken ct)
    {
        await _dbContext.Words.AddAsync(word, ct);
    }

    public async Task CreateWordsRangeAsync(List<Word> words, CancellationToken ct)
    {
        await _dbContext.Words.AddRangeAsync(words, ct);
    }

    public void UpdateWord(Word word)
    {
        _dbContext.Words.Update(word);
    }

    public void DeleteWord(Word word)
    {
        _dbContext.Words.Remove(word);
    }
}