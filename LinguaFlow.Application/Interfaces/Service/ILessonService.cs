using LinguaFlow.Application.DTO;

namespace LinguaFlow.Application.Interfaces.Service;

public interface ILessonService
{
    Task<LessonResponseDto> GetLessonById(int id, CancellationToken ct);
    Task<LessonResponseDto> CreateLesson(CreateLessonDto dto, CancellationToken ct);
    Task<LessonResponseDto> UpdateLessonById(int id, CreateLessonDto dto, CancellationToken ct);
    Task DeleteLessonById(int id, CancellationToken ct);
    
    Task AddWordsToLesson(int lessonId, List<int> wordIds, CancellationToken ct);
    Task<List<ExercisePlayDto>> GetLessonExercises(int lessonId, CancellationToken ct);
    Task<AnswerResultDto> CheckAnswer(SubmitAnswerDto dto, CancellationToken ct);
    Task CompleteLesson(int userId, CompleteLessonDto dto, CancellationToken ct);
}



