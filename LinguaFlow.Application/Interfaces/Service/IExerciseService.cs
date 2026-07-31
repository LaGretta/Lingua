using LinguaFlow.Application.DTO;

namespace LinguaFlow.Application.Interfaces.Service;

public interface IExerciseService
{
    Task<ExerciseResponseDto> CreateExercise(CreateExerciseDto dto, CancellationToken ct);
    Task<ExerciseResponseDto> UpdateExerciseById(int id, CreateExerciseDto dto, CancellationToken ct);
    Task DeleteExerciseById(int id, CancellationToken ct);
}