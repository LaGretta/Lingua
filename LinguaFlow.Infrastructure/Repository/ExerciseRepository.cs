using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LinguaFlow.Infrastructure.Repository;

public class ExerciseRepository : IExercisesRepository
{
    private readonly AppDbContext _dbContext;
    public ExerciseRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Exercise?> GetExerciseByIdAsync(int id, CancellationToken ct)
    {
        var get = await _dbContext.Exercises.FirstOrDefaultAsync(x => x.Id == id, ct);
        return get;
    }

    public async Task CreateExerciseAsync(Exercise exercise, CancellationToken ct)
    {
         await _dbContext.Exercises.AddAsync(exercise, ct);
    }

    public void UpdateExercise(Exercise exercise)
    {
        _dbContext.Exercises.Update(exercise);
    }

    public void DeleteExercise(Exercise exercise)
    {
        _dbContext.Exercises.Remove(exercise);
    }
}