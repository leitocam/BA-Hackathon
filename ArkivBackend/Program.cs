using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddControllers(); // Necesario para que se usen los controladores

// Agregar HttpClient para la inyección en ArkivService
builder.Services.AddHttpClient<ArkivService>(client =>
{
    client.BaseAddress = new Uri("http://localhost:3000"); // Configura la URL base para las solicitudes
});

// Agregar el servicio ArkivService
builder.Services.AddScoped<ArkivService>(); // Inyección de dependencia de ArkivService

// Habilitar OpenAPI (Swagger)
builder.Services.AddOpenApi();

var app = builder.Build();

// Configurar el pipeline de solicitudes HTTP
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // Habilita OpenAPI en desarrollo
}

app.UseHttpsRedirection(); // Redirección a HTTPS

// Mapea los controladores
app.MapControllers();

// Ejecuta la aplicación
app.Run();
