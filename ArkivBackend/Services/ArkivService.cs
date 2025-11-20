using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class ArkivService
{
    private readonly HttpClient _httpClient;

    // Constructor para inyectar HttpClient
    public ArkivService(HttpClient httpClient)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient)); // Aseguramos que HttpClient no sea nulo
    }

    // Método para crear una entidad
    public async Task CreateEntityAsync(string message, string type, int priority, int expiresIn)
    {
        var requestData = new
        {
            data = message,
            type = type,
            priority = priority,
            expiresIn = expiresIn
        };

        var content = new StringContent(
            JsonConvert.SerializeObject(requestData), // Serializamos el objeto a JSON
            Encoding.UTF8,
            "application/json"); // Tipo de contenido

        // Realizamos la solicitud POST al servidor Node.js
        var response = await _httpClient.PostAsync("http://localhost:3000/create-entity", content);

        if (response.IsSuccessStatusCode)
        {
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Entidad creada con éxito: {result}");
        }
        else
        {
            Console.WriteLine("Error al crear la entidad.");
        }
    }
}
