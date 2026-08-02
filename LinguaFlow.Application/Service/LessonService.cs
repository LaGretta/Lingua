using AutoMapper;
using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces;
using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Application.Interfaces.Service;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Domain.Enums;
using LinguaFlow.Domain.Services;
using Microsoft.Extensions.Logging;

namespace LinguaFlow.Application.Service;

public class LessonService : ILessonService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILessonsRepository _lessonsRepository;
    private readonly  ILogger<LessonService> _logger;
    private readonly IWordsRepository  _wordsRepository;
    private readonly IAuthRepository _authRepository;
    private readonly IUserWordProgressRepository _progressRepository;   


    public LessonService(
        IUnitOfWork unitOfWork
        , IMapper mapper
        , ILessonsRepository lessonsRepository
        , ILogger<LessonService> logger
        , IWordsRepository wordsRepository
        , IAuthRepository authRepository
        , IUserWordProgressRepository progressRepository)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _lessonsRepository = lessonsRepository;
        _logger = logger;
        _wordsRepository = wordsRepository;
        _authRepository = authRepository;
        _progressRepository = progressRepository;
    }

    public async Task<LessonResponseDto> GetLessonById(int id, CancellationToken ct)
    {
         var find = await _lessonsRepository.GetLessonByIdAsync(id, ct);
         if(find == null)
             throw new KeyNotFoundException($"Lesson with id {id} not found");
         return _mapper.Map<LessonResponseDto>(find);
    }

    public async Task<LessonResponseDto> CreateLesson(CreateLessonDto dto, CancellationToken ct)
    {
         var add = _mapper.Map<Lesson>(dto);
         await _lessonsRepository.CreateLessonAsync(add, ct);
         await _unitOfWork.SaveChangesAsync(ct);
         _logger.LogInformation("Lesson created: {Title}", add.Title);
         return _mapper.Map<LessonResponseDto>(add);
    }

    public async Task<LessonResponseDto> UpdateLessonById(int id, CreateLessonDto dto, CancellationToken ct)
    {
        var find = await _lessonsRepository.GetLessonByIdAsync(id, ct);
        if (find == null)
            throw new KeyNotFoundException($"Lesson with id {id} not found");

        _mapper.Map(dto, find);  
        _lessonsRepository.UpdateLesson(find);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Lesson updated: {Title}", find.Title);
        return _mapper.Map<LessonResponseDto>(find);
    }

    public async Task DeleteLessonById(int id, CancellationToken ct)
    {
        var find = await _lessonsRepository.GetLessonByIdAsync(id, ct);
        if(find == null)
            throw new KeyNotFoundException($"Lesson with id {id} not found");
        _lessonsRepository.DeleteLesson(find);
        await _unitOfWork.SaveChangesAsync(ct);
    }
    
    
    
    public async Task AddWordsToLesson(int lessonId, List<int> wordIds, CancellationToken ct)
    {
        var lesson = await _lessonsRepository.GetLessonByIdAsync(lessonId, ct);
        if (lesson == null)
            throw new KeyNotFoundException($"Lesson with id {lessonId} not found");

        var items = new List<LessonItem>();
        var order = 1;

        foreach (var wordId in wordIds)
        {
            items.Add(new LessonItem
            {
                LessonId = lessonId,
                WordId = wordId,
                Order = order
            });
            order++;
        }

        await _lessonsRepository.AddWordsToLessonAsync(items, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Added {Count} words to lesson {LessonId}", items.Count, lessonId);
    }
    
    
    public async Task<List<ExercisePlayDto>> GetLessonExercises(int lessonId, CancellationToken ct)
    {
        var lesson = await _lessonsRepository.GetLessonByIdAsync(lessonId, ct);
        if (lesson == null)
            throw new KeyNotFoundException($"Lesson with id {lessonId} not found");

        var words = lesson.LessonItems.Select(li => li.Word).ToList();

        if (words.Count == 0)
            throw new InvalidOperationException("Lesson has no words");

        var random = new Random();
        var exercises = new List<ExercisePlayDto>();

        foreach (var word in words)
        {
            exercises.Add(new ExercisePlayDto
            {
                WordId = word.Id,
                Type = ExerciseType.Flashcard,
                Question = word.Text,
                Options = new List<string>()
            });

            var distractors = words
                .Where(w => w.Id != word.Id)         
                .Select(w => w.Translation)          
                .OrderBy(_ => random.Next())        
                .Take(3)                       
                .ToList();

            var options = new List<string> { word.Translation }; 
            options.AddRange(distractors);                       
            options = options.OrderBy(_ => random.Next()).ToList();

            exercises.Add(new ExercisePlayDto
            {
                WordId = word.Id,
                Type = ExerciseType.MultipleChoice,
                Question = word.Text,
                Options = options
            });
        }
        return exercises;
    }
    public async Task<AnswerResultDto> CheckAnswer(SubmitAnswerDto dto, CancellationToken ct)
    {
        var word = await _wordsRepository.GetWordByIdAsync(dto.WordId, ct);
        if (word == null)
            throw new KeyNotFoundException($"Word with id {dto.WordId} not found");
        
        var isCorrect = string.Equals(
            dto.Answer.Trim(),
            word.Translation.Trim(),
            StringComparison.OrdinalIgnoreCase);

        return new AnswerResultDto
        {
            IsCorrect = isCorrect,
            CorrectAnswer = word.Translation,
            XpEarned = isCorrect ? 10 : 0
        };
    }
    
    public async Task CompleteLesson(int userId, CompleteLessonDto dto, CancellationToken ct)
    {
        var lesson = await _lessonsRepository.GetLessonByIdAsync(dto.LessonId, ct);
        if (lesson == null)
            throw new KeyNotFoundException($"Lesson with id {dto.LessonId} not found");

        var user = await _authRepository.GetByIdAsync(userId, ct);
        if (user == null)
            throw new KeyNotFoundException("User not found");
        var completion = new LessonCompletion
        {
            UserId = userId,
            LessonId = dto.LessonId,
            CompletedAt = DateTime.UtcNow,
            Score = dto.Score
        };
        await _lessonsRepository.AddCompletionAsync(completion, ct);
        user.TotalXp += dto.TotalXp;
        StreakCalculator.RegisterActivity(user, DateTime.UtcNow);
        _authRepository.UpdateUser(user);

        var lessonWordIds = lesson.LessonItems.Select(li => li.WordId).ToList();
        var existing = await _progressRepository.GetExistingWordIdsAsync(userId, lessonWordIds, ct);
        var newWordIds = lessonWordIds.Except(existing).ToList();

        var newProgress = newWordIds.Select(wordId => new UserWordProgress
        {
            UserId = userId,
            WordId = wordId,
            Repetitions = 0,
            EaseFactor = 2.5,
            IntervalDays = 1,
            NextReviewDate = DateTime.UtcNow.Date.AddDays(1),
            IsLearned = false
        }).ToList();

        if (newProgress.Count > 0)
            await _progressRepository.AddRangeAsync(newProgress, ct);

        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("User {UserId} completed lesson {LessonId}, +{Xp} XP, streak {Streak}",
            userId, dto.LessonId, dto.TotalXp, user.CurrentStreakDays);
    }
}