using LinguaFlow.Domain.Enums;

namespace LinguaFlow.Domain.Entities;

public class Exercise
{
    public int Id { get; set; }

    public int WordId { get; set; }
    public Word Word { get; set; } = null!;

    public ExerciseType ExerciseType { get; set; }

    public string Prompt { get; set; } = string.Empty;
    public string CorrectAnswer { get; set; } = string.Empty;
    public string Options { get; set; } = string.Empty;
}