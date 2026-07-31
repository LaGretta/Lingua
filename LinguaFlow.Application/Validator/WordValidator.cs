using FluentValidation;
using LinguaFlow.Application.DTO;

namespace LinguaFlow.Application.Validator;

public class WordValidator : AbstractValidator<CreateWordDto>
{
    public WordValidator()
    {
        RuleFor(n => n.Text)
            .NotEmpty().WithMessage("Text is required")
            .MaximumLength(100).WithMessage("Text must be no more than 100 characters");
        RuleFor(n => n.Translation)
            .NotEmpty().WithMessage("Translation is required")
            .MaximumLength(100).WithMessage("Translation must be no more than 100 characters");
        RuleFor(n => n.PartOfSpeech)
            .MaximumLength(50).WithMessage("PartOfSpeech must be no more than 50 characters");
        RuleFor(n => n.ExampleSentence)
            .MaximumLength(300).WithMessage("Example sentence must be no more than 300 characters");
        RuleFor(n => n.ExampleTranslation)
            .MaximumLength(300).WithMessage("Example translation must be no more than 300 characters");
    }
}