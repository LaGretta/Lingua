using AutoMapper;
using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces;
using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Application.Interfaces.Service;
using LinguaFlow.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace LinguaFlow.Application.Service;

public class CourseService : ICourseService
{
    private readonly ICoursesRepository _coursesRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<CourseService> _logger;
    
    public CourseService(
        ICoursesRepository coursesRepository
        , IUnitOfWork unitOfWork
        , IMapper mapper
        , ILogger<CourseService> logger)
    {
        _coursesRepository = coursesRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }
    public async Task<List<CourseResponseDto>> GetAllCourses(CancellationToken ct)
    {
        var all =  await _coursesRepository.GetAllCoursesAsync(ct);
        return _mapper.Map<List<CourseResponseDto>>(all);
    }
    public async Task<CourseResponseDto> GetCourseById(int courseId, CancellationToken ct)
    {
        var find = await _coursesRepository.GetCourseByIdAsync(courseId, ct);
        if(find == null)
            throw new KeyNotFoundException($"Course with id {courseId} not found");
        return _mapper.Map<CourseResponseDto>(find);
    }
    public async Task<CourseResponseDto> CreateCourse(CreateCourseDto dto, CancellationToken ct)
    {
        var add = _mapper.Map<Course>(dto);
        await _coursesRepository.CreateCourseAsync(add, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Course created: {Title}", add.Title);
        return _mapper.Map<CourseResponseDto>(add);
    }
    public async Task<CourseResponseDto> UpdateCourseById(int id, CreateCourseDto dto, CancellationToken ct)
    {
        var find = await _coursesRepository.GetCourseByIdAsync(id, ct);
        if (find == null)
            throw new KeyNotFoundException($"Course with id {id} not found");

        _mapper.Map(dto, find);  
        _coursesRepository.UpdateCourse(find);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("Course updated: {CourseId}", find.Id);
        return _mapper.Map<CourseResponseDto>(find);
    }

    public async Task DeleteCourseById(int id, CancellationToken ct)
    {
        var find = await _coursesRepository.GetCourseByIdAsync(id, ct);
        if(find == null)
            throw new KeyNotFoundException($"Course with id {id} not found");
        _coursesRepository.DeleteCourse(find);
        await _unitOfWork.SaveChangesAsync(ct);
    }
}