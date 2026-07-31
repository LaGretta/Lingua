using LinguaFlow.Application.DTO;

namespace LinguaFlow.Application.Interfaces.Service;

public interface ILessonService
{
    Task<LessonResponseDto> GetLessonById(int id, CancellationToken ct);
    Task<LessonResponseDto> CreateLesson(CreateLessonDto dto, CancellationToken ct);
    Task<LessonResponseDto> UpdateLessonById(int id, CreateLessonDto dto, CancellationToken ct);
    Task DeleteLessonById(int id, CancellationToken ct);
}



