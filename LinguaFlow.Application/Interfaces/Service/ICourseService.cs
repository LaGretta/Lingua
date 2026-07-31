using LinguaFlow.Application.DTO;

namespace LinguaFlow.Application.Interfaces.Service;

public interface ICourseService
{
    Task<List<CourseResponseDto>> GetAllCourses(CancellationToken ct);
    Task<CourseResponseDto> GetCourseById(int courseId, CancellationToken ct);
    Task<CourseResponseDto> CreateCourse(CreateCourseDto dto, CancellationToken ct);
    Task<CourseResponseDto> UpdateCourseById(int id, CreateCourseDto dto, CancellationToken ct);
    Task DeleteCourseById(int id, CancellationToken ct);
}