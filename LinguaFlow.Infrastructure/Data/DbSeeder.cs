using LinguaFlow.Application.Interfaces.Security;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace LinguaFlow.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(
        AppDbContext context, IPasswordHasher hasher, CancellationToken ct = default)
    {
        if (await context.Users.AnyAsync(u => u.Role == Role.Admin, ct))
            return;

        var admin = new User
        {
            Username = "admin",
            Email = "admin@linguaflow.local",
            PasswordHash = hasher.Hash("admin123"),
            Role = Role.Admin,
            PlanTier = PlanTier.Pro,
            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(admin);
        await context.SaveChangesAsync(ct);
    }
}