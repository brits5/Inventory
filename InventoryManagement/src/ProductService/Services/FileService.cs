namespace ProductService.Services
{
    public interface IFileService
    {
        Task<string> SaveImageAsync(IFormFile file);
        void DeleteImage(string fileName);
    }

    public class FileService : IFileService
    {
        private readonly string _uploadPath;

        public FileService(IWebHostEnvironment env)
        {
            var webRoot = env.WebRootPath ?? env.ContentRootPath;
            _uploadPath = Path.Combine(webRoot, "wwwroot", "uploads", "products");
            
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        public async Task<string> SaveImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                throw new InvalidOperationException("Formato de imagen no válido");

            if (file.Length > 5 * 1024 * 1024)
                throw new InvalidOperationException("La imagen no puede superar 5MB");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(_uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/products/{fileName}";
        }

        public void DeleteImage(string fileName)
        {
            if (string.IsNullOrEmpty(fileName)) return;

            var filePath = Path.Combine(_uploadPath, Path.GetFileName(fileName));
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}