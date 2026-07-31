using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Interfaces.Security;

public interface IJwtTokenGenerator
{
    string GenerateJwtToken(User user);
}