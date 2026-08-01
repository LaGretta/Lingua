using System.Reflection;
using FluentValidation;
using LinguaFlow.Application.Interfaces.Service;
using LinguaFlow.Application.Service;
using Microsoft.Extensions.DependencyInjection;

namespace LinguaFlow.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(cfg => cfg.AddMaps(Assembly.GetExecutingAssembly()));
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICourseService, CourseService>();
        services.AddScoped<ILessonService, LessonService>();
        services.AddScoped<IWordService, WordService>();
        services.AddScoped<IExerciseService, ExerciseService>();

        return services;
    }
}