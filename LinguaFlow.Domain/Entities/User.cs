using LinguaFlow.Domain.Enums;

namespace LinguaFlow.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public Role Role { get; set; }
    public PlanTier PlanTier { get; set; }
    public DateTime CreatedAt { get; set; }

    public int CurrentStreakDays { get; set; }
    public int LongestStreakDays { get; set; }
    public DateTime? LastActivityDate { get; set; }
    public int TotalXp { get; set; }
    
    public ICollection<UserWordProgress> WordProgress { get; set; } = new List<UserWordProgress>();
    public ICollection<LessonCompletion> LessonCompletions { get; set; } = new List<LessonCompletion>();
}