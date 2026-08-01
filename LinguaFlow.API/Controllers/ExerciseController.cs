using LinguaFlow.Application.Common;
using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LinguaFlow.API.Controllers;

[Authorize(Roles = Roles.Admin)]
[ApiController]
[Route("api/exercises")]
public class ExercisesController : ControllerBase
{
    private readonly IExerciseService _exerciseService;

    public ExercisesController(IExerciseService exerciseService)
    {
        _exerciseService = exerciseService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateExerciseDto dto, CancellationToken ct)
    {
        var created = await _exerciseService.CreateExercise(dto, ct);
        return Ok(created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateExerciseDto dto, CancellationToken ct)
    {
        var updated = await _exerciseService.UpdateExerciseById(id, dto, ct);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _exerciseService.DeleteExerciseById(id, ct);
        return NoContent();
    }
}