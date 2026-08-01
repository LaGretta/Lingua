using AutoMapper;
using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces;
using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Application.Interfaces.Service;
using LinguaFlow.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace LinguaFlow.Application.Service;

public class ExerciseService : IExerciseService
{
    private readonly IExercisesRepository _exercisesRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<ExerciseService> _logger;


    public ExerciseService(
        IExercisesRepository exercisesRepository
        , IUnitOfWork unitOfWork
        , IMapper mapper
        , ILogger<ExerciseService> logger)
    {
        _exercisesRepository = exercisesRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ExerciseResponseDto> CreateExercise(CreateExerciseDto dto, CancellationToken ct)
    {
        var add = _mapper.Map<Exercise>(dto);
        await _exercisesRepository.CreateExerciseAsync(add, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Exercise created");
        return _mapper.Map<ExerciseResponseDto>(add);
    }

    public async Task<ExerciseResponseDto> UpdateExerciseById(int id, CreateExerciseDto dto, CancellationToken ct)
    {
        var find = await _exercisesRepository.GetExerciseByIdAsync(id, ct);
        if (find == null)
            throw new KeyNotFoundException($"Exercise with id {id} not found");

        _mapper.Map(dto, find);  
        _exercisesRepository.UpdateExercise(find);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Exercise updated: {ExerciseId}", find.Id);
        return _mapper.Map<ExerciseResponseDto>(find);
    }

    public async Task DeleteExerciseById(int id, CancellationToken ct)
    {
        var find = await _exercisesRepository.GetExerciseByIdAsync(id, ct);
        if (find == null)
            throw new KeyNotFoundException($"Exercise with id {id} not found");
        _exercisesRepository.DeleteExercise(find);
        await _unitOfWork.SaveChangesAsync(ct);
    }
}