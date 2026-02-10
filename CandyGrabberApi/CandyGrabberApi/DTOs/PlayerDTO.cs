namespace CandyGrabberApi.DTOs
{
    public class PlayerDTO
    {
        public int UserId { get; init; }
        public string Username { get; init; } = null!;
        public int GameId { get; init; }
        public bool IsHost { get; init; }

        public PlayerDTO(int userId, string username, int gameId, bool isHost)
        {
            UserId = userId;
            Username = username;
            GameId = gameId;
            IsHost = isHost;
        }
    }
}
