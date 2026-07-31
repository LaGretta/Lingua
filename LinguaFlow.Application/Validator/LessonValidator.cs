using FluentValidation;
using LinguaFlow.Application.DTO;

namespace LinguaFlow.Application.Validator;

public class LessonValidator :  AbstractValidator<CreateLessonDto>
{
    public LessonValidator()
    {
        RuleFor(n => n.Title)
            .NotEmpty().WithMessage("Title is required")
            .MinimumLength(3).WithMessage("Title must be between 3 and 100 characters long")
            .MaximumLength(100).WithMessage("Title must be between 3 and 100 characters long");
        RuleFor(n => n.CourseId)
            .GreaterThan(0).WithMessage("CourseId must be greater than 0");
        RuleFor(n => n.Order)
            .GreaterThan(0).WithMessage("Order must be greater than 0");
    }
}