using LinguaFlow.Domain.Enums;

namespace LinguaFlow.Application.DTO;

public class ExercisePlayDto
{
    public int WordId { get; set; }
    public ExerciseType Type { get; set; }
    public string Question { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new();
}