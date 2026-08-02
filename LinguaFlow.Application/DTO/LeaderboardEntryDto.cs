namespace LinguaFlow.Application.DTO;

public class LeaderboardEntryDto
{
    public int Rank { get; set; }
    public string Username { get; set; } = string.Empty;
    public int TotalXp { get; set; }
    public int CurrentStreakDays { get; set; }
}