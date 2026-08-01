using LinguaFlow.Application.Common;
using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LinguaFlow.API.Controllers;

[Authorize]
[ApiController]
[Route("api/lessons")]
public class LessonsController : ControllerBase
{
    private readonly ILessonService _lessonService;

    public LessonsController(ILessonService lessonService)
    {
        _lessonService = lessonService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var lesson = await _lessonService.GetLessonById(id, ct);
        return Ok(lesson);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPost]
    public async Task<IActionResult> Create(CreateLessonDto dto, CancellationToken ct)
    {
        var created = await _lessonService.CreateLesson(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateLessonDto dto, CancellationToken ct)
    {
        var updated = await _lessonService.UpdateLessonById(id, dto, ct);
        return Ok(updated);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _lessonService.DeleteLessonById(id, ct);
        return NoContent();
    }
    
    [Authorize(Roles = Roles.Admin)]
    [HttpPost("{id}/words")]
    public async Task<IActionResult> AddWords(int id, List<int> wordIds, CancellationToken ct)
    {
        await _lessonService.AddWordsToLesson(id, wordIds, ct);
        return NoContent();
    }
    [HttpGet("{id}/exercises")]
    public async Task<IActionResult> GetExercises(int id, CancellationToken ct)
    {
        var exercises = await _lessonService.GetLessonExercises(id, ct);
        return Ok(exercises);
    }
    [HttpPost("check-answer")]
    public async Task<IActionResult> CheckAnswer(SubmitAnswerDto dto, CancellationToken ct)
    {
        var result = await _lessonService.CheckAnswer(dto, ct);
        return Ok(result);
    }
    [HttpPost("complete")]
    public async Task<IActionResult> Complete(CompleteLessonDto dto, CancellationToken ct)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        await _lessonService.CompleteLesson(userId, dto, ct);
        return NoContent();
    }
}