using FluentValidation;
using LinguaFlow.Application.DTO;

namespace LinguaFlow.Application.Validator;

public class ExerciseValidator : AbstractValidator<CreateExerciseDto>
{
    public ExerciseValidator()
    {
        RuleFor(n => n.WordId)
            .GreaterThan(0).WithMessage("WordId must be greater than 0");
        RuleFor(n => n.ExerciseType)
            .IsInEnum().WithMessage("Exercise type is invalid");
        RuleFor(n => n.Prompt)
            .NotEmpty().WithMessage("Prompt is required")
            .MaximumLength(300).WithMessage("Prompt must be no more than 300 characters");
        RuleFor(n => n.CorrectAnswer)
            .NotEmpty().WithMessage("Correct answer is required")
            .MaximumLength(200).WithMessage("Correct answer must be no more than 200 characters");
    }
}