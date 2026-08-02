using FluentAssertions;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Domain.Services;
using Xunit;

namespace LinguaFlow.Tests;

public class StreakCalculatorTests
{
    private User NewUser() => new User
    {
        CurrentStreakDays = 0,
        LongestStreakDays = 0,
        LastActivityDate = null
    };

    [Fact]
    public void FirstActivity_StartsStreakAtOne()
    {
        var user = NewUser();
        var now = new DateTime(2026, 1, 10);

        StreakCalculator.RegisterActivity(user, now);

        user.CurrentStreakDays.Should().Be(1);
        user.LastActivityDate!.Value.Date.Should().Be(now.Date);
    }
    [Fact]
    public void ActivityYesterday_ContinuesStreak()
    {
        var user = NewUser();
        user.CurrentStreakDays = 3;
        user.LastActivityDate = new DateTime(2026, 1, 9);   

        StreakCalculator.RegisterActivity(user, new DateTime(2026, 1, 10)); 

        user.CurrentStreakDays.Should().Be(4);   
    }
    [Fact]
    public void SameDayActivity_DoesNotIncrementTwice()
    {
        var user = NewUser();
        user.CurrentStreakDays = 5;
        user.LastActivityDate = new DateTime(2026, 1, 10);   

        StreakCalculator.RegisterActivity(user, new DateTime(2026, 1, 10));

        user.CurrentStreakDays.Should().Be(5); 
    }

    [Fact]
    public void MissedADay_ResetsStreakToOne()
    {
        var user = NewUser();
        user.CurrentStreakDays = 10;
        user.LastActivityDate = new DateTime(2026, 1, 8);

        StreakCalculator.RegisterActivity(user, new DateTime(2026, 1, 10));

        user.CurrentStreakDays.Should().Be(1);
    }
    [Fact]
    public void LongestStreak_IsUpdated_WhenCurrentExceedsIt()
    {
        var user = NewUser();
        user.CurrentStreakDays = 5;
        user.LongestStreakDays = 5;
        user.LastActivityDate = new DateTime(2026, 1, 9);  

        StreakCalculator.RegisterActivity(user, new DateTime(2026, 1, 10));

        user.CurrentStreakDays.Should().Be(6);
        user.LongestStreakDays.Should().Be(6);  
    }
    [Fact]
    public void LongestStreak_NotChanged_WhenResetBelowRecord()
    {
        var user = NewUser();
        user.CurrentStreakDays = 10;
        user.LongestStreakDays = 10;
        user.LastActivityDate = new DateTime(2026, 1, 1);

        StreakCalculator.RegisterActivity(user, new DateTime(2026, 1, 10));

        user.CurrentStreakDays.Should().Be(1);
        user.LongestStreakDays.Should().Be(10);
    }
}