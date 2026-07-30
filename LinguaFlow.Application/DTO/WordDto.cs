namespace LinguaFlow.Application.DTO;

public class CreateWordDto
{
    public string Text { get; set; } = string.Empty;
    public string Translation { get; set; } = string.Empty;
    public string PartOfSpeech { get; set; } = string.Empty;
    public string ExampleSentence { get; set; } = string.Empty;
    public string ExampleTranslation { get; set; } = string.Empty;
}
public class WordResponseDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Translation { get; set; } = string.Empty;
    public string PartOfSpeech { get; set; } = string.Empty;
    public string ExampleSentence { get; set; } = string.Empty;
    public string ExampleTranslation { get; set; } = string.Empty;
}