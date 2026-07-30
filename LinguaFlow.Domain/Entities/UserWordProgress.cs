namespace LinguaFlow.Domain.Entities;

public class UserWordProgress
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int WordId { get; set; }
    public Word Word { get; set; } = null!;

    // стан алгоритму повторення (SM-2)
    public int Repetitions { get; set; }
    public double EaseFactor { get; set; }
    public int IntervalDays { get; set; }
    public DateTime NextReviewDate { get; set; }
    public DateTime? LastReviewedAt { get; set; }

    public bool IsLearned { get; set; }
}