using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Application.Interfaces.Repository;

public interface IAuthRepository
{
    Task<User?>  GetUserByEmailAsync(string email , CancellationToken ct);
    Task<bool> ExistsUserByEmailAsync(string email , CancellationToken ct);
    Task CreateUserAsync(User user, CancellationToken ct);
}