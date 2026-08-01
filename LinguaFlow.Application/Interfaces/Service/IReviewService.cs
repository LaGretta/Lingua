using LinguaFlow.Application.DTO;

namespace LinguaFlow.Application.Interfaces.Service;

public interface IReviewService
{
    Task<List<ReviewWordDto>> GetWordsForToday(int userId, CancellationToken ct);
    Task GradeWord(int userId, GradeReviewDto dto, CancellationToken ct);
}