using ProjectSm3.VNPayIntegration;

namespace ProjectSm3.Repositories.Interface
{
    public interface IVnPayServiceRepo
    {
        string CreatePaymentUrl(PaymentInformation model, HttpContext context);
        PaymentResponse PaymentExecute(IQueryCollection collections);
    }
}
