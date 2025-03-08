using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ProjectSm3.Dto.Request;
public class VnpayService
{
    private readonly string vnp_TmnCode;
    private readonly string vnp_HashSecret;
    private readonly string vnp_Url;
    private readonly string returnUrl;

    public VnpayService(IConfiguration configuration)
    {
        vnp_TmnCode = configuration["Vnpay:TmnCode"];
        vnp_HashSecret = configuration["Vnpay:HashSecret"];
        vnp_Url = configuration["Vnpay:Url"];
        returnUrl = configuration["Vnpay:ReturnUrl"];
    }

    public string CreatePaymentUrl(PaymentRequest model, HttpContext context)
    {
        string vnp_TxnRef = DateTime.Now.Ticks.ToString();
        string vnp_CreateDate = DateTime.Now.ToString("yyyyMMddHHmmss");

        var vnp_Params = new SortedDictionary<string, string>
        {
            { "vnp_Version", "2.1.0" },
            { "vnp_Command", "pay" },
            { "vnp_TmnCode", vnp_TmnCode },
            { "vnp_Amount", (model.Amount * 100).ToString() },
            { "vnp_CurrCode", "VND" },
            { "vnp_TxnRef", vnp_TxnRef },
            { "vnp_OrderInfo", "Thanh toan ve xem phim" },
            { "vnp_OrderType", "billpayment" },
            { "vnp_Locale", "vn" },
            { "vnp_ReturnUrl", returnUrl },
            { "vnp_IpAddr", context.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1" },
            { "vnp_CreateDate", vnp_CreateDate },
            { "vnp_SecureHashType", "HMACSHA512" }

        };

        string signData = string.Join("&", vnp_Params.Select(kvp => $"{kvp.Key}={HttpUtility.UrlEncode(kvp.Value)}"));
        string vnp_SecureHash = HmacSHA512(vnp_HashSecret, signData);

        vnp_Params.Add("vnp_SecureHash", vnp_SecureHash);

        string paymentUrl = vnp_Url + "?" + string.Join("&", vnp_Params.Select(kvp => $"{kvp.Key}={HttpUtility.UrlEncode(kvp.Value)}"));

        return paymentUrl;
    }

    private static string HmacSHA512(string key, string data)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
        byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return BitConverter.ToString(hash).Replace("-", "").ToLower();
    }
}
