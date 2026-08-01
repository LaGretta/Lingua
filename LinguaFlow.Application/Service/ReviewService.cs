using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces;
using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Application.Interfaces.Service;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Domain.Services;
using Microsoft.Extensions.Logging;

namespace LinguaFlow.Application.Service;

public class ReviewService : IReviewService
{
    private readonly IUserWordProgressRepository _progressRepository;
    private readonly IWordsRepository _wordsRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ReviewService> _logger;

    public ReviewService(
        IUserWordProgressRepository progressRepository,
        IWordsRepository wordsRepository,
        IUnitOfWork unitOfWork,
        ILogger<ReviewService> logger)
    {
        _progressRepository = progressRepository;
        _wordsRepository = wordsRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<List<ReviewWordDto>> GetWordsForToday(int userId, CancellationToken ct)
    {
        var due = await _progressRepository.GetDueForReviewAsync(userId, ct);

        return due.Select(p => new ReviewWordDto
        {
            WordId = p.WordId,
            Text = p.Word.Text,
            Translation = p.Word.Translation,
            ExampleSentence = p.Word.ExampleSentence
        }).ToList();
    }

    public async Task GradeWord(int userId, GradeReviewDto dto, CancellationToken ct)
    {
        var progress = await _progressRepository.GetAsync(userId, dto.WordId, ct);

        if (progress == null)
        {
            progress = new UserWordProgress
            {
                UserId = userId,
                WordId = dto.WordId,
                Repetitions = 0,
                EaseFactor = 2.5,
                IntervalDays = 0,
                NextReviewDate = DateTime.UtcNow.Date
            };

            SpacedRepetitionCalculator.ApplyReview(progress, dto.Grade);
            await _progressRepository.AddAsync(progress, ct);
        }
        else
        {
            SpacedRepetitionCalculator.ApplyReview(progress, dto.Grade);
            _progressRepository.Update(progress);
        }
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("User {UserId} graded word {WordId} as {Grade}",
            userId, dto.WordId, dto.Grade);
    }
}