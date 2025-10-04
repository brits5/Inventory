using Microsoft.EntityFrameworkCore;
using TransactionService.Data;
using TransactionService.Models.Entities;

namespace TransactionService.Repositories
{
    public interface ITransactionRepository
    {
        Task<Transaction> CreateAsync(Transaction transaction);
        Task<IEnumerable<Transaction>> GetByProductIdAsync(int productId, DateTime? startDate, DateTime? endDate, string? type);
        Task<IEnumerable<Transaction>> GetAllAsync(DateTime? startDate, DateTime? endDate, string? type);
    }

    public class TransactionRepository : ITransactionRepository
    {
        private readonly TransactionDbContext _context;

        public TransactionRepository(TransactionDbContext context)
        {
            _context = context;
        }

        public async Task<Transaction> CreateAsync(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<IEnumerable<Transaction>> GetByProductIdAsync(int productId, DateTime? startDate, DateTime? endDate, string? type)
        {
            var query = _context.Transactions.Where(t => t.ProductId == productId);

            if (startDate.HasValue)
                query = query.Where(t => t.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(t => t.Date <= endDate.Value);

            if (!string.IsNullOrEmpty(type))
                query = query.Where(t => t.Type == type);

            return await query.OrderByDescending(t => t.Date).ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> GetAllAsync(DateTime? startDate, DateTime? endDate, string? type)
        {
            var query = _context.Transactions.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(t => t.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(t => t.Date <= endDate.Value);

            if (!string.IsNullOrEmpty(type))
                query = query.Where(t => t.Type == type);

            return await query.OrderByDescending(t => t.Date).ToListAsync();
        }
    }
}