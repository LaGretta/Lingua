using FluentValidation;
using LinguaFlow.Application.DTO;

namespace LinguaFlow.Application.Validator;

public class CourseValidator :  AbstractValidator<CreateCourseDto>
{
    public CourseValidator()
    {
        RuleFor(n => n.Title)
            .NotEmpty().WithMessage("Title is required")
            .MinimumLength(3).WithMessage("Title must be between 3 and 50 characters long")
            .MaximumLength(50).WithMessage("Title must be between 3 and 50 characters long");
        RuleFor(n => n.Description)
            .NotEmpty().WithMessage("Description is required")
            .MinimumLength(3).WithMessage("Description must be between 3 and 500 characters long")
            .MaximumLength(500).WithMessage("Description must be between 3 and 500 characters long");
        RuleFor(n => n.LanguageLevel)
            .IsInEnum().WithMessage("Language level is invalid");
    }
}