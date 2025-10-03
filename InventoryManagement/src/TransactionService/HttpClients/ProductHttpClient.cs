using System.Text;
using System.Text.Json;
using TransactionService.Models.DTOs;

namespace TransactionService.HttpClients
{
    public interface IProductHttpClient
    {
        Task<ProductDto?> GetProductAsync(int productId);
        Task<bool> UpdateStockAsync(int productId, int quantity, string type);
    }

    public class ProductHttpClient : IProductHttpClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ProductHttpClient> _logger;

        public ProductHttpClient(HttpClient httpClient, ILogger<ProductHttpClient> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<ProductDto?> GetProductAsync(int productId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/api/products/{productId}");
                if (!response.IsSuccessStatusCode) return null;

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<ProductDto>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener producto {ProductId}", productId);
                return null;
            }
        }

        public async Task<bool> UpdateStockAsync(int productId, int quantity, string type)
        {
            try
            {
                var payload = new { quantity, type };
                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PatchAsync($"/api/products/{productId}/stock", content);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar stock del producto {ProductId}", productId);
                return false;
            }
        }
    }
}