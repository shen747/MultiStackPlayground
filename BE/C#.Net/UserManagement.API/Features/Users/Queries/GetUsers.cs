using MediatR;
using UserManagement.API.Data;
using UserManagement.API.Domain;
using UserManagement.API.Types;

namespace UserManagement.API.Features.Users.Queries;

public record GetUsersQuery(
    int PageNumber = 1,
    int PageSize = 10,
    string? SearchTerm = null
) : IRequest<Result<GetUsersResponse>>;

public record GetUsersResponse(
    IEnumerable<UserDto> Users,
    int TotalCount,
    int PageNumber,
    int PageSize,
    int TotalPages
);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    DateTime CreatedAt,
    bool IsActive
);

public class GetUsersHandler(IRepository<User> userRepository) : IRequestHandler<GetUsersQuery, Result<GetUsersResponse>>
{
    private readonly IRepository<User> _userRepository = userRepository;

    public async Task<Result<GetUsersResponse>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var allUsers = await _userRepository.GetAllAsync();
            
            // Apply search filter if provided
            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                allUsers = allUsers.Where(u => 
                    u.Email.ToLower().Contains(searchTerm) ||
                    u.FirstName.ToLower().Contains(searchTerm) ||
                    u.LastName.ToLower().Contains(searchTerm));
            }

            var totalCount = allUsers.Count();
            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            // Apply pagination
            var users = allUsers
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(u => new UserDto(
                    u.Id,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.CreatedAt,
                    u.IsActive
                ))
                .ToList();

            var response = new GetUsersResponse(
                users,
                totalCount,
                request.PageNumber,
                request.PageSize,
                totalPages
            );

            return Result<GetUsersResponse>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<GetUsersResponse>.Failure($"Failed to retrieve users: {ex.Message}");
        }
    }
}
