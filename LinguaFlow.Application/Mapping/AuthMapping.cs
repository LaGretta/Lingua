using AutoMapper;
using LinguaFlow.Application.DTO;
using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Mapping;

public class AuthMapping : Profile
{
    public AuthMapping()
    {
        CreateMap<RegisterDto, User>();
        CreateMap<User, AuthResponseDto>();
        CreateMap<User, UserResponseDto>();
    }
}