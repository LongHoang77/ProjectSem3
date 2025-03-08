using Microsoft.EntityFrameworkCore;
using ProjectSm3.Data;
using ProjectSm3.Dto.Database;

namespace ProjectSm3.Repositories;
// public class PaymentRepository : IPaymentRepository
// {
//     private readonly ApplicationDbContext _context;
//     public PaymentRepository(ApplicationDbContext context) => _context = context;

//     public async Task SaveTransactionAsync(PaymentTransactionDto transaction)
//     {
//         _context.PaymentTransactions.Add(transaction);
//         await _context.SaveChangesAsync();
//     }

//     public async Task<List<PaymentTransactionDto>> GetAllTransactionsAsync()
//         => await _context.PaymentTransactions.ToListAsync();
// }
public class PaymentRepository : IPaymentRepository
{
    private readonly ApplicationDbContext _context;

    public PaymentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SaveTransactionAsync(PaymentTransactionDto transaction)
    {
        var paymentTransaction = new PaymentTransactionDto
        {
            Amount = transaction.Amount,
            TransactionId = transaction.TransactionId,
            OrderDescription = transaction.OrderDescription,
            PaymentStatus = transaction.PaymentStatus,
            PaymentMethod = transaction.PaymentMethod,
            CreatedDate = DateTime.UtcNow
        };

        _context.PaymentTransactions.Add(paymentTransaction);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<PaymentTransactionDto>> GetAllTransactionsAsync()
    {
        return await _context.PaymentTransactions
            .Select(pt => new PaymentTransactionDto
            {
                Amount = pt.Amount,
                TransactionId = pt.TransactionId,
                OrderDescription = pt.OrderDescription,
                PaymentStatus = pt.PaymentStatus,
                PaymentMethod = pt.PaymentMethod
            })
            .ToListAsync();
    }
}