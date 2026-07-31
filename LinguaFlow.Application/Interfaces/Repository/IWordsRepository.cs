using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Interfaces.Repository;

public interface IWordsRepository
{
    Task<Word?> GetWordByIdAsync(int id, CancellationToken ct);
    Task CreateWordAsync(Word word, CancellationToken ct);
    Task CreateWordsRangeAsync(List<Word> words, CancellationToken ct);
    void UpdateWord(Word word);
    void DeleteWord(Word word);
}
