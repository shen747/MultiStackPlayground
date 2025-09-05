using MediatR;
using UserManagement.API.Data;
using UserManagement.API.Domain;
using UserManagement.API.Types;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace UserManagement.API.Features.Users.Commands;

public record LoginUserCommand(
    string Email,
    string Password
) : IRequest<Result<LoginResponse>>;

public record LoginResponse(
    Guid UserId,
    string Email,
    string FirstName,
    string LastName,
    string Token
);

public class LoginUserHandler : IRequestHandler<LoginUserCommand, Result<LoginResponse>>
{
    private readonly IRepository<User> _userRepository;
    private readonly IConfiguration _configuration;

    public LoginUserHandler(IRepository<User> userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<Result<LoginResponse>> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Find user by email
            var user = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);
            if (user == null)
            {
                return Result<LoginResponse>.Failure("Invalid email or password");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Result<LoginResponse>.Failure("Invalid email or password");
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            var response = new LoginResponse(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                token
            );

            return Result<LoginResponse>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<LoginResponse>.Failure($"Login failed: {ex.Message}");
        }
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? "DefaultSecretKeyForDevelopment123456789";
        var issuer = jwtSettings["Issuer"] ?? "UserManagementAPI";
        var audience = jwtSettings["Audience"] ?? "UserManagementAPI";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
