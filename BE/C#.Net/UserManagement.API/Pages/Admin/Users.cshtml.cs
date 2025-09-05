using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using UserManagement.API.Features.Users.Queries;

namespace UserManagement.API.Pages.Admin;

public class UsersModel : PageModel
{
    private readonly IMediator _mediator;

    public UsersModel(IMediator mediator)
    {
        _mediator = mediator;
    }

    [BindProperty(SupportsGet = true)]
    public string? SearchTerm { get; set; }

    [BindProperty(SupportsGet = true)]
    public int PageNumber { get; set; } = 1;

    [BindProperty(SupportsGet = true)]
    public int PageSize { get; set; } = 10;

    public GetUsersResponse? UsersData { get; private set; }
    public bool HasError { get; private set; }
    public string ErrorMessage { get; private set; } = string.Empty;

    public async Task OnGetAsync()
    {
        var query = new GetUsersQuery(PageNumber, PageSize, SearchTerm);
        var result = await _mediator.Send(query);

        if (result.IsSuccess)
        {
            UsersData = result.Data;
            HasError = false;
        }
        else
        {
            HasError = true;
            ErrorMessage = result.ErrorMessage;
        }
    }
}
