using CandyGrabberApi.Domain;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.DataContext
{
    public class CandyGrabberContext : DbContext
    {
        public CandyGrabberContext(DbContextOptions<CandyGrabberContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Winner> Winners { get; set; }
        public DbSet<FriendsList>? FriendsLists { get; set; }
        public DbSet<ChatMessage> Messages { get; set; }
        public DbSet<FriendRequest> Requests { get; set; }
        public DbSet<GameRequest> GameRequests { get; set; }
        public DbSet<GameItem> GameItems { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Candy> Candies { get; set; }
        public DbSet<PowerUp> PowerUps { get; set; }
        public DbSet<PlayerItem> PlayerItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Item>(entity => {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
            });

            modelBuilder.Entity<Candy>(entity => {
                entity.HasKey(e => e.ItemId);
                entity.HasOne<Item>()
                      .WithOne()
                      .HasForeignKey<Candy>(e => e.ItemId);
            });

            modelBuilder.Entity<PowerUp>(entity => {
                entity.HasKey(e => e.ItemId);
                entity.HasOne<Item>()
                      .WithOne()
                      .HasForeignKey<PowerUp>(e => e.ItemId);
            });

            modelBuilder.Entity<Player>(entity => {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.X).HasDefaultValue(0);
                entity.Property(e => e.Y).HasDefaultValue(0);
                entity.Property(e => e.Points).HasDefaultValue(0);
            });

            modelBuilder.Entity<GameItem>(entity => {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.X).IsRequired();
                entity.Property(e => e.Y).IsRequired();
            });

            modelBuilder.Entity<PlayerItem>(entity => {
                entity.HasKey(e => e.Id);
            });
        }
    }
}