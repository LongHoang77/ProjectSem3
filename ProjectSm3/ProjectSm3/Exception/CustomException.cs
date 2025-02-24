namespace ProjectSm3.Exception;

public class CustomException(string message, int statusCode = 400) : System.Exception(message)
{
    public int StatusCode { get; set; } = statusCode;
    public string ErrorMessage { get; set; } = message;
}