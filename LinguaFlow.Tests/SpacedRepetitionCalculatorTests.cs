using FluentAssertions;
using LinguaFlow.Domain.Entities;
using LinguaFlow.Domain.Enums;
using LinguaFlow.Domain.Services;
using Xunit;

namespace LinguaFlow.Tests;

public class SpacedRepetitionCalculatorTests
{
    private UserWordProgress NewProgress() => new UserWordProgress
    {
        Repetitions = 0,
        EaseFactor = 2.5,
        IntervalDays = 0,
        NextReviewDate = DateTime.UtcNow.Date
    };

    [Fact]
    public void FirstCorrectAnswer_SetsIntervalToOneDay()
    {
        var progress = NewProgress();

        SpacedRepetitionCalculator.ApplyReview(progress, ReviewGrade.Good);

        progress.Repetitions.Should().Be(1);
        progress.IntervalDays.Should().Be(1);
    }
    [Fact]
    public void SecondCorrectAnswer_SetsIntervalToSixDays()
    {
        var progress = NewProgress();

        SpacedRepetitionCalculator.ApplyReview(progress, ReviewGrade.Good); // 1-й
        SpacedRepetitionCalculator.ApplyReview(progress, ReviewGrade.Good); // 2-й

        progress.Repetitions.Should().Be(2);
        progress.IntervalDays.Should().Be(6);
    }
    [Fact]
    public void Again_ResetsProgress()
    {
        var progress = NewProgress();
        SpacedRepetitionCalculator.ApplyReview(progress, ReviewGrade.Good);
        SpacedRepetitionCalculator.ApplyReview(progress, ReviewGrade.Good);

        SpacedRepetitionCalculator.ApplyReview(progress, ReviewGrade.Again);

        progress.Repetitions.Should().Be(0);
        progress.IntervalDays.Should().Be(1);
    }
    [Fact]
    public void EaseFactor_NeverDropsBelow_1_3()
    {
        var progress = NewProgress();

        for (int i = 0; i < 10; i++)
            SpacedRepetitionCalculator.ApplyReview(progress, ReviewGrade.Again);

        progress.EaseFactor.Should().BeGreaterThanOrEqualTo(1.3);
    }
    [Fact]
    public void EasyAnswer_IncreasesEaseFactor()
    {
        var progress = NewProgress();
        var before = progress.EaseFactor;

        SpacedRepetitionCalculator.ApplyReview(progress, ReviewGrade.Easy);

        progress.EaseFactor.Should().BeGreaterThan(before);
    }

    [Fact]
    public void NextReviewDate_IsInFuture_AfterCorrectAnswer()
    {
        var progress = NewProgress();

        SpacedRepetitionCalculator.ApplyReview(progress, ReviewGrade.Good);

        progress.NextReviewDate.Should().BeAfter(DateTime.UtcNow.Date);
    }
}