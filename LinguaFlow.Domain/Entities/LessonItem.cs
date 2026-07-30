namespace LinguaFlow.Domain.Entities;

public class LessonItem
{
    public int Id { get; set; }

    public int LessonId { get; set; }
    public Lesson Lesson { get; set; } = null!;

    public int WordId { get; set; }
    public Word Word { get; set; } = null!;

    public int Order { get; set; }
}