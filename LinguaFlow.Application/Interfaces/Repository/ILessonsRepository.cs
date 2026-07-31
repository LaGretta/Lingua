using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Interfaces.Repository;

public interface ILessonsRepository
{
    Task<Lesson?> GetLessonByIdAsync(int id, CancellationToken ct);
    Task CreateLessonAsync(Lesson lesson, CancellationToken ct);
    void UpdateLesson(Lesson lesson);
    void DeleteLesson(Lesson lesson);
}