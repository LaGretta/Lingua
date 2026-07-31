using AutoMapper;
using LinguaFlow.Application.DTO;
using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Mapping;

public class ExerciseMapping : Profile
{
    public ExerciseMapping()
    {
        CreateMap<CreateExerciseDto, Exercise>();
        CreateMap<Exercise, ExerciseResponseDto>();
    }
}