using ProjectSm3.Dto.Database;

namespace ProjectSm3.Repositories;
public interface IPaymentRepository
// {
//     Task SaveTransactionAsync(PaymentTransactionDto transaction);
//     Task<List<PaymentTransactionDto>> GetAllTransactionsAsync();
// }

{
    Task SaveTransactionAsync(PaymentTransactionDto transaction);
    Task<IEnumerable<PaymentTransactionDto>> GetAllTransactionsAsync();
    Task<int> GetSuccessfulTransactionCountAsync();
    
    
}