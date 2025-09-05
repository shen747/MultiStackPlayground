namespace UserManagement.API.Events;

public record UserRegisteredEvent(
    Guid UserId,
    string Username,
    string FullName,
    string Gender,
    DateTime RegisteredAt
);
