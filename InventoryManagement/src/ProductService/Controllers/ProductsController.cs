using Microsoft.AspNetCore.Mvc;
using ProductService.Models.DTOs;
using ProductService.Models.Entities;
using ProductService.Repositories;
using ProductService.Services;

namespace ProductService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _repository;
        private readonly IFileService _fileService;

        public ProductsController(IProductRepository repository, IFileService fileService)
        {
            _repository = repository;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            var products = await _repository.GetAllAsync();
            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Category = p.Category,
                ImageUrl = p.ImageUrl,
                Price = p.Price,
                Stock = p.Stock
            });
            return Ok(productDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) return NotFound();

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Category = product.Category,
                ImageUrl = product.ImageUrl,
                Price = product.Price,
                Stock = product.Stock
            };
            return Ok(productDto);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create([FromForm] CreateProductDto dto, [FromForm] IFormFile? image)
        {
            string imageUrl = null;
            if (image != null)
            {
                try
                {
                    imageUrl = await _fileService.SaveImageAsync(image);
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category,
                ImageUrl = imageUrl ?? dto.ImageUrl,
                Price = dto.Price,
                Stock = dto.Stock
            };

            var created = await _repository.CreateAsync(product);
            var productDto = new ProductDto
            {
                Id = created.Id,
                Name = created.Name,
                Description = created.Description,
                Category = created.Category,
                ImageUrl = created.ImageUrl,
                Price = created.Price,
                Stock = created.Stock
            };
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, productDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDto>> Update(int id, [FromForm] UpdateProductDto dto, [FromForm] IFormFile? image)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) return NotFound();

            string oldImageUrl = product.ImageUrl;

            if (image != null)
            {
                try
                {
                    product.ImageUrl = await _fileService.SaveImageAsync(image);
                    if (!string.IsNullOrEmpty(oldImageUrl))
                    {
                        _fileService.DeleteImage(oldImageUrl);
                    }
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else if (!string.IsNullOrEmpty(dto.ImageUrl))
            {
                product.ImageUrl = dto.ImageUrl;
            }

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Category = dto.Category;
            product.Price = dto.Price;
            product.Stock = dto.Stock;

            var updated = await _repository.UpdateAsync(product);
            var productDto = new ProductDto
            {
                Id = updated.Id,
                Name = updated.Name,
                Description = updated.Description,
                Category = updated.Category,
                ImageUrl = updated.ImageUrl,
                Price = updated.Price,
                Stock = updated.Stock
            };
            return Ok(productDto);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) return NotFound();

            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                _fileService.DeleteImage(product.ImageUrl);
            }

            var result = await _repository.DeleteAsync(id);
            return NoContent();
        }

        [HttpPatch("{id}/stock")]
        public async Task<ActionResult> UpdateStock(int id, UpdateStockDto dto)
        {
            var result = await _repository.UpdateStockAsync(id, dto.Quantity, dto.Type);
            if (!result) return BadRequest("Stock insuficiente o producto no encontrado");
            return NoContent();
        }
    }
}