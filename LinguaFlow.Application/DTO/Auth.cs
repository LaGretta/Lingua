using LinguaFlow.Domain.Enums;

namespace LinguaFlow.Application.DTO;

public class RegisterDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } =  string.Empty;
    public string Password { get; set; } = string.Empty;
}
public class LoginDto
{
    public string Email { get; set; } =  string.Empty;
    public string Password { get; set; } = string.Empty;
}
public class AuthResponseDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public Role Role { get; set; }
    public PlanTier PlanTier { get; set; }
}