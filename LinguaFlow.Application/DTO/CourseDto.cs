using LinguaFlow.Domain.Enums;

namespace LinguaFlow.Application.DTO;

public class CreateCourseDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public LanguageLevel LanguageLevel { get; set; }
    public int Order { get; set; }
}
public class CourseResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public LanguageLevel LanguageLevel { get; set; }
    public int LessonsCount  { get; set; }
    public int Order { get; set; }
}