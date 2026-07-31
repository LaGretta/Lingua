using AutoMapper;
using LinguaFlow.Application.DTO;
using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Mapping;

public class CourseMapping : Profile
{ 
    public CourseMapping()
    {
        CreateMap<CreateCourseDto, Course>();
        CreateMap<Course, CourseResponseDto>()
            .ForMember(d => d.LessonsCount, o => o.MapFrom(s => s.Lessons.Count));
    }
}