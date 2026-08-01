using AutoMapper;
using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces;
using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Application.Interfaces.Service;
using LinguaFlow.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace LinguaFlow.Application.Service;

public class WordService : IWordService
{
    private readonly IMapper _mapper;
    private readonly IWordsRepository _wordsRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<WordService> _logger;

    public WordService(
        IMapper mapper
        , IWordsRepository wordsRepository
        , IUnitOfWork unitOfWork
        , ILogger<WordService> logger)
    {
        _mapper = mapper;
        _wordsRepository = wordsRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<WordResponseDto> GetWordById(int id, CancellationToken ct)
    {
        var find = await _wordsRepository.GetWordByIdAsync(id, ct);
        if(find == null)
            throw new KeyNotFoundException($"Word with id {id} not found");
        return _mapper.Map<WordResponseDto>(find);
    }

    public async Task<WordResponseDto> CreateWord(CreateWordDto dto, CancellationToken ct)
    {
        var add = _mapper.Map<Word>(dto);
        await _wordsRepository.CreateWordAsync(add, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Word created");
        return _mapper.Map<WordResponseDto>(add);
    }

    public async Task<WordResponseDto> UpdateWordById(int id, CreateWordDto dto, CancellationToken ct)
    {
        var find = await _wordsRepository.GetWordByIdAsync(id, ct);
        if (find == null)
            throw new KeyNotFoundException($"Word with id {id} not found");

        _mapper.Map(dto, find);  
        _wordsRepository.UpdateWord(find);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Word updated: {WordId}", find.Id);
        return _mapper.Map<WordResponseDto>(find);
    }

    public async Task DeleteWordById(int id, CancellationToken ct)
    {
        var find = await _wordsRepository.GetWordByIdAsync(id, ct);
        if (find == null)
            throw new KeyNotFoundException($"Course with id {id} not found");
        _wordsRepository.DeleteWord(find);
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task<int> ImportWords(List<CreateWordDto> words, CancellationToken ct)
    {
        if (words == null || words.Count == 0)
            throw new InvalidOperationException("No words to import");

        var entities = _mapper.Map<List<Word>>(words);

        await _wordsRepository.CreateWordsRangeAsync(entities, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Imported {Count} words", entities.Count);
        return entities.Count;
    }
}