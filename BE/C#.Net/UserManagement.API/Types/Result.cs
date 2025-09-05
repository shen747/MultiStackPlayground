namespace UserManagement.API.Types;

public class Result
{
    public bool IsSuccess { get; protected set; }
    public string ErrorMessage { get; protected set; } = string.Empty;
    public List<string> Errors { get; protected set; } = new();

    protected Result(bool isSuccess, string errorMessage = "")
    {
        IsSuccess = isSuccess;
        ErrorMessage = errorMessage;
        if (!string.IsNullOrEmpty(errorMessage))
        {
            Errors.Add(errorMessage);
        }
    }

    protected Result(bool isSuccess, List<string> errors)
    {
        IsSuccess = isSuccess;
        Errors = errors ?? new List<string>();
        ErrorMessage = string.Join("; ", Errors);
    }

    public static Result Success() => new(true);
    public static Result Failure(string error) => new(false, error);
    public static Result Failure(List<string> errors) => new(false, errors);
}

public class Result<T> : Result
{
    public T Data { get; private set; }

    private Result(bool isSuccess, T data, string errorMessage = "") : base(isSuccess, errorMessage)
    {
        Data = data;
    }

    private Result(bool isSuccess, T data, List<string> errors) : base(isSuccess, errors)
    {
        Data = data;
    }

    public static Result<T> Success(T data) => new(true, data);
    public static new Result<T> Failure(string error) => new(false, default(T)!, error);
    public static new Result<T> Failure(List<string> errors) => new(false, default(T)!, errors);

    // Implicit conversion from T to Result<T>
    public static implicit operator Result<T>(T data) => Success(data);

    // Method to convert Result<T> to Result
    public Result ToResult() => IsSuccess ? Result.Success() : Result.Failure(Errors);
}

// Extension methods for Result
public static class ResultExtensions
{
    public static Result<TOut> Map<TIn, TOut>(this Result<TIn> result, Func<TIn, TOut> mapper)
    {
        return result.IsSuccess 
            ? Result<TOut>.Success(mapper(result.Data))
            : Result<TOut>.Failure(result.Errors);
    }

    public static async Task<Result<TOut>> MapAsync<TIn, TOut>(this Result<TIn> result, Func<TIn, Task<TOut>> mapper)
    {
        if (!result.IsSuccess)
            return Result<TOut>.Failure(result.Errors);

        try
        {
            var mappedData = await mapper(result.Data);
            return Result<TOut>.Success(mappedData);
        }
        catch (Exception ex)
        {
            return Result<TOut>.Failure(ex.Message);
        }
    }

    public static Result<T> OnSuccess<T>(this Result<T> result, Action<T> action)
    {
        if (result.IsSuccess)
            action(result.Data);
        return result;
    }

    public static Result<T> OnFailure<T>(this Result<T> result, Action<string> action)
    {
        if (!result.IsSuccess)
            action(result.ErrorMessage);
        return result;
    }

    public static async Task<Result<T>> OnSuccessAsync<T>(this Result<T> result, Func<T, Task> action)
    {
        if (result.IsSuccess)
            await action(result.Data);
        return result;
    }

    public static async Task<Result<T>> OnFailureAsync<T>(this Result<T> result, Func<string, Task> action)
    {
        if (!result.IsSuccess)
            await action(result.ErrorMessage);
        return result;
    }
}
