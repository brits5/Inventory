// TransactionService/Controllers/TransactionsController.cs
using Microsoft.AspNetCore.Mvc;
using TransactionService.HttpClients;
using TransactionService.Models.DTOs;
using TransactionService.Models.Entities;
using TransactionService.Repositories;

namespace TransactionService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionRepository _repository;
        private readonly IProductHttpClient _productClient;

        public TransactionsController(ITransactionRepository repository, IProductHttpClient productClient)
        {
            _repository = repository;
            _productClient = productClient;
        }

        [HttpPost]
        public async Task<ActionResult<TransactionDto>> Create(CreateTransactionDto dto)
        {
            var product = await _productClient.GetProductAsync(dto.ProductId);
            if (product == null)
                return NotFound("Producto no encontrado");

            if (dto.Type.ToLower() == "venta" && product.Stock < dto.Quantity)
                return BadRequest("Stock insuficiente para realizar la venta");

            var totalPrice = dto.UnitPrice * dto.Quantity;
            var transaction = new Transaction
            {
                Type = dto.Type,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice,
                TotalPrice = totalPrice,
                Details = dto.Details
            };

            var created = await _repository.CreateAsync(transaction);

            var stockUpdated = await _productClient.UpdateStockAsync(dto.ProductId, dto.Quantity, dto.Type);
            if (!stockUpdated)
                return StatusCode(500, "Error al actualizar el stock del producto");

            var productUpdated = await _productClient.GetProductAsync(dto.ProductId);

            var transactionDto = new TransactionDto
            {
                Id = created.Id,
                Date = created.Date,
                Type = created.Type,
                ProductId = created.ProductId,
                ProductName = productUpdated?.Name ?? product.Name,
                ProductStock = productUpdated?.Stock ?? product.Stock,
                Quantity = created.Quantity,
                UnitPrice = created.UnitPrice,
                TotalPrice = created.TotalPrice,
                Details = created.Details
            };

            return CreatedAtAction(nameof(GetByProductId), new { productId = created.ProductId }, transactionDto);
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetByProductId(
            int productId,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] string? type)
        {
            var product = await _productClient.GetProductAsync(productId);
            if (product == null)
                return NotFound("Producto no encontrado");

            var transactions = await _repository.GetByProductIdAsync(productId, startDate, endDate, type);

            var transactionDtos = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                Date = t.Date,
                Type = t.Type,
                ProductId = t.ProductId,
                ProductName = product.Name,
                ProductStock = product.Stock,
                Quantity = t.Quantity,
                UnitPrice = t.UnitPrice,
                TotalPrice = t.TotalPrice,
                Details = t.Details
            });

            return Ok(transactionDtos);
        }
    }
}