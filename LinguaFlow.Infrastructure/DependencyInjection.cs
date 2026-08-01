using LinguaFlow.Application.Interfaces;
using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Application.Interfaces.Security;
using LinguaFlow.Infrastructure.Data;
using LinguaFlow.Infrastructure.Repository;
using LinguaFlow.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LinguaFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<ICoursesRepository, CourseRepository>();
        services.AddScoped<ILessonsRepository, LessonRepository>();
        services.AddScoped<IWordsRepository, WordRepository>();
        services.AddScoped<IExercisesRepository, ExerciseRepository>();
        services.AddScoped<IUserWordProgressRepository, UserWordProgressRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        return services;
    }
}