using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Interfaces.Repository;

public interface ICoursesRepository
{
    Task<List<Course>> GetAllCoursesAsync(CancellationToken ct);
    Task<Course?>  GetCourseByIdAsync(int id, CancellationToken ct);
    Task CreateCourseAsync(Course course, CancellationToken ct);
    void UpdateCourse(Course course);
    void DeleteCourse(Course course);
}