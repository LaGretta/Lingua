using AutoMapper;
using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces;
using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Application.Interfaces.Service;
using LinguaFlow.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace LinguaFlow.Application.Service;

public class LessonService : ILessonService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILessonsRepository _lessonsRepository;
    private readonly  ILogger<LessonService> _logger;

    public LessonService(
        IUnitOfWork unitOfWork
        , IMapper mapper
        , ILessonsRepository lessonsRepository
        , ILogger<LessonService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _lessonsRepository = lessonsRepository;
        _logger = logger;
    }

    public async Task<LessonResponseDto> GetLessonById(int id, CancellationToken ct)
    {
         var find = await _lessonsRepository.GetLessonByIdAsync(id, ct);
         if(find == null)
             throw new KeyNotFoundException($"Lesson with id {id} not found");
         return _mapper.Map<LessonResponseDto>(find);
    }

    public async Task<LessonResponseDto> CreateLesson(CreateLessonDto dto, CancellationToken ct)
    {
         var add = _mapper.Map<Lesson>(dto);
         await _lessonsRepository.CreateLessonAsync(add, ct);
         await _unitOfWork.SaveChangesAsync(ct);
         _logger.LogInformation("Lesson created: {Title}", add.Title);
         return _mapper.Map<LessonResponseDto>(add);
    }

    public async Task<LessonResponseDto> UpdateLessonById(int id, CreateLessonDto dto, CancellationToken ct)
    {
        var find = await _lessonsRepository.GetLessonByIdAsync(id, ct);
        if (find == null)
            throw new KeyNotFoundException($"Lesson with id {id} not found");

        _mapper.Map(dto, find);  
        _lessonsRepository.UpdateLesson(find);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Lesson updated: {Title}", find.Title);
        return _mapper.Map<LessonResponseDto>(find);
    }

    public async Task DeleteLessonById(int id, CancellationToken ct)
    {
        var find = await _lessonsRepository.GetLessonByIdAsync(id, ct);
        if(find == null)
            throw new KeyNotFoundException($"Lesson with id {id} not found");
        _lessonsRepository.DeleteLesson(find);
        await _unitOfWork.SaveChangesAsync(ct);
    }
}