using AutoMapper;
using LinguaFlow.Application.DTO;
using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Mapping;

public class WordMapping : Profile
{
    public WordMapping()
    {
        CreateMap<CreateWordDto, Word>();
        CreateMap<Word, WordResponseDto>();
    }
}