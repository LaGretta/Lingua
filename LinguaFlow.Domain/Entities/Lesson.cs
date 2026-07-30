namespace LinguaFlow.Domain.Entities;

public class Lesson
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Order { get; set; }              

    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public ICollection<LessonItem> LessonItems { get; set; } = new List<LessonItem>();
}