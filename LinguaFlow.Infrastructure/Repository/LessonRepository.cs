using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LinguaFlow.Infrastructure.Repository;

public class LessonRepository : ILessonsRepository
{
    private readonly AppDbContext _dbContext;

    public LessonRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Lesson?> GetLessonByIdAsync(int id, CancellationToken ct)
    {
        return await _dbContext.Lessons
            .Include(l => l.LessonItems)
            .ThenInclude(li => li.Word)
            .ThenInclude(w => w.Exercises)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task CreateLessonAsync(Lesson lesson, CancellationToken ct)
    {
       await _dbContext.Lessons.AddAsync(lesson, ct);
    }

    public void UpdateLesson(Lesson lesson)
    {
         _dbContext.Lessons.Update(lesson);
    }

    public void DeleteLesson(Lesson lesson)
    {
        _dbContext.Lessons.Remove(lesson);
    }
    
    
    public async Task AddWordsToLessonAsync(List<LessonItem> items, CancellationToken ct)
    {
        await _dbContext.LessonItems.AddRangeAsync(items, ct);
    }
    public async Task AddCompletionAsync(LessonCompletion completion, CancellationToken ct)
    {
        await _dbContext.LessonCompletions.AddAsync(completion, ct);
    }
}

