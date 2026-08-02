using LinguaFlow.Domain.Entities;

namespace LinguaFlow.Domain.Services;

public static class StreakCalculator
{
    public static void RegisterActivity(User user, DateTime nowUtc)
    {
        var today = nowUtc.Date;
        if(user.LastActivityDate?.Date == today)
            return;
        var yesterday = today.AddDays(-1);
        if (user.LastActivityDate?.Date == yesterday)
        {
            user.CurrentStreakDays++;
        }
        else
        {
            user.CurrentStreakDays = 1;
        }
        user.LastActivityDate = today;

        if (user.CurrentStreakDays > user.LongestStreakDays)
            user.LongestStreakDays = user.CurrentStreakDays;
    }
}