using CandyGrabberApi.Domain;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.DataContext
{
    public class CandyGrabberContext : DbContext
    {
        public CandyGrabberContext(DbContextOptions<CandyGrabberContext> options) : base(options)
        { }
        public DbSet<User> Users { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Winner> Winners { get; set; }
        public DbSet<FriendsList>? FriendsLists { get; set; }
        public DbSet<ChatMessage> Messages { get; set; }
        public DbSet<FriendRequest> Requests { get; set; }
        public DbSet<GameRequest> GameRequests { get; set; }
        public DbSet<GameItem> GameItems { get; set; }
    }
}
