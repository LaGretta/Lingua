namespace LinguaFlow.Application.DTO;

public class SubmitAnswerDto
{
    public int WordId { get; set; }
    public string Answer { get; set; } = string.Empty;
}
public class AnswerResultDto
{
    public bool IsCorrect { get; set; }
    public string CorrectAnswer { get; set; } = string.Empty;
    public int XpEarned { get; set; }
}