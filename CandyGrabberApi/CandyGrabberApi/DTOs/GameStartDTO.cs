namespace CandyGrabberApi.DTOs
{
    public class GameStartDTO
    {
        public int GameId { get; set; }
        public PlayerDTO Player1 { get; set; } = new PlayerDTO();
        public PlayerDTO Player2 { get; set; } = new PlayerDTO();
    }
}
