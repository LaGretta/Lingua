using LinguaFlow.Domain.Entities;
using LinguaFlow.Domain.Enums;

namespace LinguaFlow.Domain.Services;

public static class SpacedRepetitionCalculator
{
    public static void ApplyReview(UserWordProgress progress, ReviewGrade grade)
    {
        if (grade == ReviewGrade.Again)
        {
            progress.Repetitions = 0;
            progress.IntervalDays = 1;
        }
        else
        {
            progress.Repetitions++;

            progress.IntervalDays = progress.Repetitions switch
            {
                1 => 1,                                             
                2 => 6,                                        
                _ => (int)Math.Round(progress.IntervalDays * progress.EaseFactor) 
            };
        }
        var g = (int)grade;
        progress.EaseFactor += 0.1 - (3 - g) * (0.08 + (3 - g) * 0.02);

        if (progress.EaseFactor < 1.3)
            progress.EaseFactor = 1.3;

        progress.NextReviewDate = DateTime.UtcNow.Date.AddDays(progress.IntervalDays);
        progress.LastReviewedAt = DateTime.UtcNow;
        progress.IsLearned = progress.IntervalDays >= 21;
    }
}