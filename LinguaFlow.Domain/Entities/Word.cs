namespace LinguaFlow.Domain.Entities;

public class Word
{
    public int Id { get; set; }
    //(англійське слово)
    public string Text { get; set; } = string.Empty;
    //(переклад)
    public string Translation  { get; set; } = string.Empty;
    //(частина мови — рядок)
    public string PartOfSpeech { get; set; } = string.Empty;
    //(приклад речення)
    public string ExampleSentence { get; set; } = string.Empty;
    //(переклад прикладу)
    public string ExampleTranslation  { get; set; } = string.Empty;
    
    
    public ICollection<LessonItem> LessonItems { get; set; } = new List<LessonItem>();
    public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
}