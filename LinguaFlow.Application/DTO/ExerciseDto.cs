using LinguaFlow.Domain.Enums;

namespace LinguaFlow.Application.DTO;

public class CreateExerciseDto
{
    public int WordId { get; set; }
    public ExerciseType ExerciseType { get; set; }
    public string Prompt { get; set; } = string.Empty;
    public string CorrectAnswer { get; set; } = string.Empty;
    public string Options { get; set; } = string.Empty;
}

public class ExerciseResponseDto
{
    public int Id { get; set; }
    public ExerciseType ExerciseType { get; set; }
    public string Prompt { get; set; } = string.Empty;
    public string Options { get; set; } = string.Empty;
}
