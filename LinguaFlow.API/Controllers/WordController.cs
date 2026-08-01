using LinguaFlow.Application.Common;
using LinguaFlow.Application.DTO;
using LinguaFlow.Application.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LinguaFlow.API.Controllers;

[Authorize(Roles = Roles.Admin)]
[ApiController]
[Route("api/words")]
public class WordsController : ControllerBase
{
    private readonly IWordService _wordService;

    public WordsController(IWordService wordService)
    {
        _wordService = wordService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var word = await _wordService.GetWordById(id, ct);
        return Ok(word);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateWordDto dto, CancellationToken ct)
    {
        var created = await _wordService.CreateWord(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPost("import")]
    public async Task<IActionResult> Import(List<CreateWordDto> words, CancellationToken ct)
    {
        var count = await _wordService.ImportWords(words, ct);
        return Ok(new { imported = count });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateWordDto dto, CancellationToken ct)
    {
        var updated = await _wordService.UpdateWordById(id, dto, ct);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _wordService.DeleteWordById(id, ct);
        return NoContent();
    }
}