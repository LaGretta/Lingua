using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LinguaFlow.Infrastructure.Repository;

public class CourseRepository : ICoursesRepository
{
    private readonly AppDbContext _dbContext;
    public CourseRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Course>> GetAllCoursesAsync(CancellationToken ct)
    {
        return await _dbContext.Courses
            .Include(c => c.Lessons)
            .ToListAsync(ct);
    }

    public async Task<Course?> GetCourseByIdAsync(int id, CancellationToken ct)
    {
        return await _dbContext.Courses
            .Include(c => c.Lessons)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task CreateCourseAsync(Course course, CancellationToken ct)
    {
         await _dbContext.Courses.AddAsync(course, ct);
    }

    public void UpdateCourse(Course course)
    {
        _dbContext.Courses.Update(course);
    }

    public void DeleteCourse(Course course)
    {
        _dbContext.Courses.Remove(course);
    }
}