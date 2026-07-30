using LinguaFlow.Domain.Enums;

namespace LinguaFlow.Application.DTO;

public class UserResponseDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Role Role { get; set; }
    public PlanTier PlanTier { get; set; }
    public int CurrentStreakDays { get; set; }
    public int TotalXp { get; set; }
}