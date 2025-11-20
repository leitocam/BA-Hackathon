using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ArkivController : ControllerBase
{
    private readonly ArkivService _arkivService;

    // Aseguramos que el servicio esté inyectado correctamente
    public ArkivController(ArkivService arkivService)
    {
        _arkivService = arkivService ?? throw new ArgumentNullException(nameof(arkivService));
    }

    // Método POST para crear una entidad
    [HttpPost("create")]
    public async Task<IActionResult> CreateEntity([FromBody] EntityRequest model)
    {
        // Llamamos al servicio para crear la entidad
        await _arkivService.CreateEntityAsync(model.Message, model.Type, model.Priority, model.ExpiresIn);
        return Ok("Entidad creada con éxito");
    }
}

// Clase para definir el cuerpo de la solicitud
public class EntityRequest
{
    public string? Message { get; set; }
    public string? Type { get; set; }
    public int Priority { get; set; }
    public int ExpiresIn { get; set; }
}

