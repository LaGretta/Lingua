using AutoMapper;
using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces;
using LinguaFlow.Application.Interfaces.Repository;
using LinguaFlow.Application.Interfaces.Security;
using LinguaFlow.Application.Interfaces.Service;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace LinguaFlow.Application.Service;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ILogger<AuthService> _logger;
    
    public AuthService(
        IAuthRepository authRepository
        , IUnitOfWork unitOfWork
        , IMapper mapper
        , IPasswordHasher passwordHasher
        , IJwtTokenGenerator jwtTokenGenerator
        , ILogger<AuthService> logger)
    {
        _authRepository = authRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _logger = logger;
    }

    public async Task<AuthResponseDto> Register(RegisterDto registerDto, CancellationToken ct)
    {
        if (await _authRepository.ExistsUserByEmailAsync(registerDto.Email, ct))
            throw new InvalidOperationException("Email already exists");

        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = _passwordHasher.Hash(registerDto.Password),
            Role = Role.User,
            PlanTier = PlanTier.Free,
            CreatedAt = DateTime.UtcNow
        };
        
        await _authRepository.CreateUserAsync(user , ct);
        await _unitOfWork.SaveChangesAsync(ct);
        _logger.LogInformation("New user registered: {Email}", user.Email);
        
        var response = _mapper.Map<AuthResponseDto>(user);
        response.Token = _jwtTokenGenerator.GenerateJwtToken(user);
        return response;
    }

    public async Task<AuthResponseDto> Login(LoginDto login, CancellationToken ct)
    {
        var find = await _authRepository.GetUserByEmailAsync(login.Email, ct);
        if (find == null || !_passwordHasher.Verify(login.Password, find.PasswordHash))
        {
            _logger.LogWarning("Failed login attempt for {Email}", login.Email);
            throw new UnauthorizedAccessException("Email or password is incorrect");
        }
        
        _logger.LogInformation("User logged in: {Email}", find.Email);
        var response = _mapper.Map<AuthResponseDto>(find);
        response.Token = _jwtTokenGenerator.GenerateJwtToken(find);
        return response;
    }
}