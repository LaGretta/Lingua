using LinguaFlow.Application.Common;
using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LinguaFlow.API.Controllers;

[Authorize]
[ApiController]
[Route("api/courses")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CoursesController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var courses = await _courseService.GetAllCourses(ct);
        return Ok(courses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var course = await _courseService.GetCourseById(id, ct);
        return Ok(course);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPost]
    public async Task<IActionResult> Create(CreateCourseDto dto, CancellationToken ct)
    {
        var created = await _courseService.CreateCourse(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateCourseDto dto, CancellationToken ct)
    {
        var updated = await _courseService.UpdateCourseById(id, dto, ct);
        return Ok(updated);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _courseService.DeleteCourseById(id, ct);
        return NoContent();
    }
}