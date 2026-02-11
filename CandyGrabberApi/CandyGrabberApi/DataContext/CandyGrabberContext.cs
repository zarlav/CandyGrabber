using CandyGrabberApi.Domain;
using CandyGrabberApi.Domain.Enums;
using CandyGrabberApi.Models;
using Microsoft.EntityFrameworkCore;

public class CandyGrabberContext : DbContext
{
    public CandyGrabberContext(DbContextOptions<CandyGrabberContext> options) : base(options) { }

    public DbSet<User> User { get; set; }
    public DbSet<Player> Player { get; set; }
    public DbSet<Game> Game { get; set; }
    public DbSet<Winner> Winner { get; set; }
    public DbSet<FriendsList> FriendsList { get; set; }
    public DbSet<ChatMessage> ChatMessage { get; set; }
    public DbSet<FriendRequest> FriendRequest { get; set; }
    public DbSet<GameRequest> GameRequest { get; set; }
    public DbSet<GameItem> GameItem { get; set; }
    public DbSet<Item> Item { get; set; }
    public DbSet<Candy> Candy { get; set; }
    public DbSet<PowerUp> PowerUp { get; set; }
    public DbSet<PlayerItem> PlayerItem { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasPostgresEnum("PowerEffect", new[] { "SPEED_BOOST", "FREEZE", "SHIELD", "DOUBLE_POINTS" });
        modelBuilder.HasPostgresEnum("ItemType", new[] { "CANDY", "POWER_UP" });
        modelBuilder.HasPostgresEnum("GameStatus", new[] { "Created", "Lobby", "Countdown", "InProgress", "Paused", "WaitingForReconnect", "Finished", "Canceled" });
        modelBuilder.HasPostgresEnum("GameRequestStatus", new[] { "NONE", "SENT", "ACCEPTED", "DECLINED" });
        modelBuilder.HasPostgresEnum("FriendRequestStatus", new[] { "NONE", "ACCEPTED", "SENT", "DECLINED" });

        // User
        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        // Player
        modelBuilder.Entity<Player>()
            .HasKey(p => p.Id);

        modelBuilder.Entity<Player>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Player>()
            .HasOne(p => p.Game)
            .WithMany(g => g.Players)
            .HasForeignKey(p => p.GameId)
            .OnDelete(DeleteBehavior.Restrict);

        // Game
        modelBuilder.Entity<Game>()
            .HasKey(g => g.Id);

        // GameItem
        modelBuilder.Entity<GameItem>()
            .HasKey(gi => gi.Id);

        modelBuilder.Entity<GameItem>()
            .HasOne(gi => gi.Game)
            .WithMany(g => g.GameItems)
            .HasForeignKey(gi => gi.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<GameItem>()
            .HasOne(gi => gi.Item)
            .WithMany()
            .HasForeignKey("ItemId")
            .OnDelete(DeleteBehavior.Cascade);

        // FriendsList
        modelBuilder.Entity<FriendsList>()
            .HasKey(fl => fl.Id);

        modelBuilder.Entity<FriendsList>()
            .HasOne(fl => fl.User)
            .WithMany()
            .HasForeignKey(fl => fl.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<FriendsList>()
            .HasOne(fl => fl.Friend)
            .WithMany()
            .HasForeignKey(fl => fl.FriendId)
            .OnDelete(DeleteBehavior.Restrict);

        // ChatMessage
        modelBuilder.Entity<ChatMessage>()
            .HasKey(cm => cm.Id);

        modelBuilder.Entity<ChatMessage>()
            .HasOne(cm => cm.Sender)
            .WithMany()
            .HasForeignKey(cm => cm.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ChatMessage>()
            .HasOne(cm => cm.Recipient)
            .WithMany()
            .HasForeignKey(cm => cm.RecipientId)
            .OnDelete(DeleteBehavior.Restrict);

        // FriendRequest
        modelBuilder.Entity<FriendRequest>()
            .HasKey(fr => fr.Id);

        modelBuilder.Entity<FriendRequest>()
            .HasOne(fr => fr.Sender)
            .WithMany()
            .HasForeignKey(fr => fr.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<FriendRequest>()
            .HasOne(fr => fr.Recipient)
            .WithMany()
            .HasForeignKey(fr => fr.RecipientId)
            .OnDelete(DeleteBehavior.Restrict);

        // GameRequest
        modelBuilder.Entity<GameRequest>()
            .HasKey(gr => gr.Id);

        modelBuilder.Entity<GameRequest>()
            .HasOne(gr => gr.Sender)
            .WithMany()
            .HasForeignKey(gr => gr.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<GameRequest>()
            .HasOne(gr => gr.Recipient)
            .WithMany()
            .HasForeignKey(gr => gr.RecipientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<GameRequest>()
            .HasOne(gr => gr.Game)
            .WithMany(g => g.Invitations)
            .HasForeignKey(gr => gr.GameId)
            .OnDelete(DeleteBehavior.Restrict);

        // Item
        modelBuilder.Entity<Item>()
            .HasKey(i => i.Id);

        // Candy
        modelBuilder.Entity<Candy>()
            .HasKey(c => c.ItemId);

        modelBuilder.Entity<Candy>()
            .HasOne<Candy>()
            .WithOne()
            .HasForeignKey<Candy>(c => c.ItemId)
            .OnDelete(DeleteBehavior.Cascade);

        // PowerUp
        modelBuilder.Entity<PowerUp>()
            .HasKey(pu => pu.ItemId);

        modelBuilder.Entity<PowerUp>()
            .HasOne<PowerUp>()
            .WithOne()
            .HasForeignKey<PowerUp>(pu => pu.ItemId)
            .OnDelete(DeleteBehavior.Cascade);

        // PlayerItem
        modelBuilder.Entity<PlayerItem>()
            .HasKey(pi => pi.Id);

        modelBuilder.Entity<PlayerItem>()
            .HasOne(pi => pi.Player)
            .WithMany(p => p.PlayerItems)
            .HasForeignKey(pi => pi.PlayerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PlayerItem>()
            .HasOne(pi => pi.Item)
            .WithMany()
            .HasForeignKey("ItemId")
            .OnDelete(DeleteBehavior.Restrict);

        // Winner
        modelBuilder.Entity<Winner>()
            .HasKey(w => w.Id);

        modelBuilder.Entity<Winner>()
            .HasOne(w => w.Player)
            .WithMany()
            .HasForeignKey(w => w.PlayerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

