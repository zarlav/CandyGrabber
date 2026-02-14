namespace CandyGrabberApi.DTOs
{
    public class PlayerDTO
    {
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public int GameId { get; init; }
        public PlayerDTO() { }
        public PlayerDTO(int userId, string username, int gameId)
        {
            UserId = userId;
            Username = username;
            GameId = gameId;
        }
    }
}
