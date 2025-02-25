using System.Text.Json;

namespace ProjectSm3.Exception;

public class GlobalExceptionMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (System.Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, System.Exception exception)
    {
        context.Response.ContentType = "application/json";

        switch (exception)
        {
            case ArgumentException argEx:
            {
                context.Response.StatusCode = 400;
                var response = new
                {
                    StatusCode = 400,
                    Message = argEx.Message
                };
                return context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
            case CustomException customEx:
            {
                context.Response.StatusCode = customEx.StatusCode;
                var response = new
                {
                    StatusCode = customEx.StatusCode,
                    Message = customEx.ErrorMessage
                };
                return context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        }

        context.Response.StatusCode = 500;
        var defaultResponse = new
        {
            StatusCode = 500,
            Message = "Đã xảy ra lỗi không mong muốn.",
            DetailedError = exception.ToString()
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(defaultResponse));
    }
}