using LinguaFlow.Application.DTO;

namespace LinguaFlow.Application.Interfaces.Service;

public interface IAuthService
{
    Task<AuthResponseDto> Register(RegisterDto registerDto , CancellationToken ct);
    Task<AuthResponseDto> Login(LoginDto login , CancellationToken ct);
    
    Task<UserResponseDto> GetProfile(int userId, CancellationToken ct);
}