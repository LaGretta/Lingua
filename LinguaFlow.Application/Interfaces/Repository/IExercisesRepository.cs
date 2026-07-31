using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Interfaces.Repository;

public interface IExercisesRepository
{
    Task<Exercise?> GetExerciseByIdAsync(int id, CancellationToken ct);
    Task CreateExerciseAsync(Exercise exercise, CancellationToken ct);
    void UpdateExercise(Exercise exercise);
    void DeleteExercise(Exercise exercise);
}