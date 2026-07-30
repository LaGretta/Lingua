using LinguaFlow.Domain.Enums;

namespace LinguaFlow.Domain.Entities;

public class Course
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public LanguageLevel LanguageLevel { get; set; }
    public int Order { get; set; }
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}
