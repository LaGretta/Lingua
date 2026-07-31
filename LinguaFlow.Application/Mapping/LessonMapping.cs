using AutoMapper;
using LinguaFlow.Application.DTO;
using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Mapping;

public class LessonMapping : Profile
{
    public LessonMapping()
    {
        CreateMap<CreateLessonDto, Lesson>();
        CreateMap<Lesson, LessonResponseDto>();
    }
}