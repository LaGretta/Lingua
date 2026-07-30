namespace LinguaFlow.Application.DTO;

public class CreateLessonDto
{
    public string Title { get; set; } = string.Empty;
    public int Order { get; set; }
    public int CourseId { get; set; }
}

public class LessonResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Order { get; set; }              
    public int CourseId { get; set; }
}