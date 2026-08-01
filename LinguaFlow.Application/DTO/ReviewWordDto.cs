using LinguaFlow.Domain.Enums;

namespace LinguaFlow.Application.DTO;

public class ReviewWordDto
{
    public int WordId { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Translation { get; set; } = string.Empty;
    public string ExampleSentence { get; set; } = string.Empty;
}
public class GradeReviewDto
{
    public int WordId { get; set; }
    public ReviewGrade Grade { get; set; }
}