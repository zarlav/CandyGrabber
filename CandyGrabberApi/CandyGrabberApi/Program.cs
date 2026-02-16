using CandyGrabberApi;
using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.Services;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR(options =>
{
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(60); // koliko dugo server ceka na klijenta
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);     // koliko ?esto server šalje ping
});

// Repositories
builder.Services.AddScoped<IPlayerItemRepository, PlayerItemRepository>();
builder.Services.AddScoped<IPowerUpRepository, PowerUpRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IItemRepository, ItemRepository>();
builder.Services.AddScoped<IChatMessagesRepository, ChatMessagesRepository>();
builder.Services.AddScoped<IFriendsListRepository, FriendsListRepository>();
builder.Services.AddScoped<IGameRepository, GameRepository>();
builder.Services.AddScoped<IGameRequestRepository, GameRequestRepository>();
builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();
builder.Services.AddScoped<IFriendRequestRepository, FriendRequestRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IWinnerRepository, WinnerRepository>();
builder.Services.AddScoped<IGameItemRepository, GameItemRepository>();
builder.Services.AddScoped<ICandyRepository, CandyRepository>();
builder.Services.AddScoped<IJWTservice, JWTservice>();

// Services
builder.Services.AddScoped<IChatMessagesService, ChatMessagesService>();
builder.Services.AddScoped<IFriendRequestService, FriendRequestService>();
builder.Services.AddScoped<IFriendsListService, FriendsListService>();
builder.Services.AddScoped<IGameItemService, GameItemService>();
builder.Services.AddScoped<IGameRequestServices, GameRequestServices>();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddScoped<IPlayerService, PlayerService>();
builder.Services.AddScoped<IUserService, UserService>();

// DbContext
builder.Services.AddDbContext<CandyGrabberContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddAuthorization();
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "https://localhost:3000",
            "https://localhost:7274",
            "https://localhost:4200",
            "http://localhost:5174" 
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

// CORS mora pre MapHub i MapControllers
app.UseCors("AllowFrontend");

app.UseAuthorization();

// SignalR Hub
app.MapHub<ChatHub>("/chathub");

// Controllers
app.MapControllers();

app.Run();
