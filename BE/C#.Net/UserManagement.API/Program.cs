using MediatR;
using Microsoft.EntityFrameworkCore;
using Serilog;
using StructureMap;
using UserManagement.API.Data;
using UserManagement.API.Services;
using UserManagement.API.Features.Users.Commands;
using UserManagement.API.Features.Users.Queries;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Configure services first
builder.Services.AddOpenApi();

// Add Razor Pages
builder.Services.AddRazorPages();

// Add Entity Framework DbContext to the default DI container first
// This is needed for EF design-time tools to work properly
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Create a registry for StructureMap configuration
var registry = new Registry();

// Replace default DI with StructureMap
registry.Scan(scanner =>
{
    scanner.TheCallingAssembly();
    scanner.WithDefaultConventions();
    scanner.ConnectImplementationsToTypesClosing(typeof(IRequestHandler<,>));
});

// Register DbContext in StructureMap as well (will use the one from DI container)
registry.For<AppDbContext>().Use(ctx => ctx.GetInstance<AppDbContext>()).ContainerScoped();

// Register Generic Repository
registry.For(typeof(IRepository<>)).Use(typeof(Repository<>)).ContainerScoped();

// Register other services
registry.For<IUserReportService>().Use<UserReportService>().ContainerScoped();
registry.For<IMessageServiceBus>().Use<MessageServiceBus>().ContainerScoped();

// Configure StructureMap as the service provider factory
builder.Host.UseServiceProviderFactory(new StructureMapServiceProviderFactory(registry));

// Add MediatR
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Map Razor Pages
app.MapRazorPages();

// Add endpoints
app.MapPost("/register", async (RegisterUserCommand command, IMediator mediator) =>
{
    var userId = await mediator.Send(command);
    return Results.Created($"/users/{userId}", userId);
});

app.MapGet("/users", async ([FromQuery] string? gender, IMediator mediator) =>
{
    var users = await mediator.Send(new GetUsersQuery(SearchTerm: gender));
    return Results.Ok(users);
});

app.Run();