using MediatR;
using UserManagement.API.Data;
using UserManagement.API.Domain;
using UserManagement.API.Services;
using UserManagement.API.Events;

namespace UserManagement.API.Features.Users.Commands;

public record RegisterUserCommand(string Username, string Password, string FullName, string Gender) : IRequest<Guid>;

public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Guid>
{
    private readonly IRepository<User> _userRepository;

    public RegisterUserCommandHandler(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            PasswordHash = passwordHash,
            FullName = request.FullName,
            Gender = request.Gender
        };

        await _userRepository.AddAsync(user);

        return user.Id;
    }
}
