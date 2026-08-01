using LinguaFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LinguaFlow.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<LessonItem> LessonItems { get; set; }
    public DbSet<Word> Words { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<UserWordProgress> UserWordProgress { get; set; }
    public DbSet<LessonCompletion> LessonCompletions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();

        modelBuilder.Entity<Course>()
            .HasMany(c => c.Lessons)
            .WithOne(l => l.Course)
            .HasForeignKey(l => l.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Lesson>()
            .HasMany(l => l.LessonItems)
            .WithOne(li => li.Lesson)
            .HasForeignKey(li => li.LessonId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LessonItem>()
            .HasOne(li => li.Word)
            .WithMany(w => w.LessonItems)
            .HasForeignKey(li => li.WordId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Word>()
            .HasMany(w => w.Exercises)
            .WithOne(e => e.Word)
            .HasForeignKey(e => e.WordId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserWordProgress>()
            .HasOne(uwp => uwp.User)
            .WithMany(u => u.WordProgress)
            .HasForeignKey(uwp => uwp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserWordProgress>()
            .HasOne(uwp => uwp.Word)
            .WithMany()
            .HasForeignKey(uwp => uwp.WordId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<UserWordProgress>()
            .HasIndex(uwp => new { uwp.UserId, uwp.WordId })
            .IsUnique();

        modelBuilder.Entity<LessonCompletion>()
            .HasOne(lc => lc.User)
            .WithMany(u => u.LessonCompletions)
            .HasForeignKey(lc => lc.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LessonCompletion>()
            .HasOne(lc => lc.Lesson)
            .WithMany()
            .HasForeignKey(lc => lc.LessonId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<LessonCompletion>()
            .Property(lc => lc.Score)
            .HasPrecision(5, 2);
    }
}