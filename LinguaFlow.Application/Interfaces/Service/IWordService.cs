using LinguaFlow.Application.DTO;

namespace LinguaFlow.Application.Interfaces.Service;

public interface IWordService
{
    Task<WordResponseDto> GetWordById(int id, CancellationToken ct);
    Task<WordResponseDto> CreateWord(CreateWordDto dto, CancellationToken ct);
    Task<WordResponseDto> UpdateWordById(int id, CreateWordDto dto, CancellationToken ct);
    Task DeleteWordById(int id, CancellationToken ct);
    Task<int> ImportWords(List<CreateWordDto> words, CancellationToken ct);
}