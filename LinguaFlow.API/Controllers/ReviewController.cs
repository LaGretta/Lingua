using System.Security.Claims;
using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LinguaFlow.API.Controllers;

[Authorize]
[ApiController]
[Route("api/review")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetToday(CancellationToken ct)
    {
        var userId = GetUserId();
        var words = await _reviewService.GetWordsForToday(userId, ct);
        return Ok(words);
    }
    [HttpPost("grade")]
    public async Task<IActionResult> Grade(GradeReviewDto dto, CancellationToken ct)
    {
        var userId = GetUserId();
        await _reviewService.GradeWord(userId, dto, ct);
        return NoContent();
    }
    private int GetUserId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }
}