using UserManagement.API.Data;
using UserManagement.API.Domain;
using UserManagement.API.Types;
using System.Text;

namespace UserManagement.API.Services;

public interface IUserReportService
{
    Task<Result<UserReportData>> GenerateUserReportAsync();
    Task<Result<string>> GenerateUserReportCsvAsync();
    Task<Result<byte[]>> GenerateUserReportPdfAsync();
}

public record UserReportData(
    int TotalUsers,
    int ActiveUsers,
    int InactiveUsers,
    DateTime ReportGeneratedAt,
    IEnumerable<UserReportItem> Users
);

public record UserReportItem(
    Guid Id,
    string Email,
    string FullName,
    DateTime CreatedAt,
    bool IsActive,
    int DaysSinceRegistration
);

public class UserReportService : IUserReportService
{
    private readonly IRepository<User> _userRepository;
    private readonly IMessageServiceBus _messageServiceBus;
    private readonly ILogger<UserReportService> _logger;

    public UserReportService(
        IRepository<User> userRepository,
        IMessageServiceBus messageServiceBus,
        ILogger<UserReportService> logger)
    {
        _userRepository = userRepository;
        _messageServiceBus = messageServiceBus;
        _logger = logger;
    }

    public async Task<Result<UserReportData>> GenerateUserReportAsync()
    {
        try
        {
            var users = await _userRepository.GetAllAsync();
            var reportItems = users.Select(u => new UserReportItem(
                u.Id,
                u.Email,
                $"{u.FirstName} {u.LastName}",
                u.CreatedAt,
                u.IsActive,
                (DateTime.UtcNow - u.CreatedAt).Days
            )).ToList();

            var reportData = new UserReportData(
                TotalUsers: users.Count(),
                ActiveUsers: users.Count(u => u.IsActive),
                InactiveUsers: users.Count(u => !u.IsActive),
                ReportGeneratedAt: DateTime.UtcNow,
                Users: reportItems
            );

            // Send notification about report generation
            await _messageServiceBus.SendMessageAsync(new
            {
                EventType = "UserReportGenerated",
                Timestamp = DateTime.UtcNow,
                TotalUsers = reportData.TotalUsers,
                ActiveUsers = reportData.ActiveUsers
            }, "user-reports");

            _logger.LogInformation("User report generated successfully with {TotalUsers} users", reportData.TotalUsers);

            return Result<UserReportData>.Success(reportData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate user report");
            return Result<UserReportData>.Failure($"Failed to generate user report: {ex.Message}");
        }
    }

    public async Task<Result<string>> GenerateUserReportCsvAsync()
    {
        try
        {
            var reportResult = await GenerateUserReportAsync();
            if (!reportResult.IsSuccess)
            {
                return Result<string>.Failure(reportResult.ErrorMessage);
            }

            var csv = new StringBuilder();
            csv.AppendLine("Id,Email,FullName,CreatedAt,IsActive,DaysSinceRegistration");

            foreach (var user in reportResult.Data.Users)
            {
                csv.AppendLine($"{user.Id},{user.Email},{user.FullName},{user.CreatedAt:yyyy-MM-dd},{user.IsActive},{user.DaysSinceRegistration}");
            }

            return Result<string>.Success(csv.ToString());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate CSV user report");
            return Result<string>.Failure($"Failed to generate CSV report: {ex.Message}");
        }
    }

    public async Task<Result<byte[]>> GenerateUserReportPdfAsync()
    {
        try
        {
            // This is a placeholder implementation
            // In a real application, you would use a PDF library like iTextSharp or similar
            var reportResult = await GenerateUserReportAsync();
            if (!reportResult.IsSuccess)
            {
                return Result<byte[]>.Failure(reportResult.ErrorMessage);
            }

            var pdfContent = $"User Report Generated: {reportResult.Data.ReportGeneratedAt}\n" +
                           $"Total Users: {reportResult.Data.TotalUsers}\n" +
                           $"Active Users: {reportResult.Data.ActiveUsers}\n" +
                           $"Inactive Users: {reportResult.Data.InactiveUsers}";

            var bytes = Encoding.UTF8.GetBytes(pdfContent);
            return Result<byte[]>.Success(bytes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate PDF user report");
            return Result<byte[]>.Failure($"Failed to generate PDF report: {ex.Message}");
        }
    }
}
