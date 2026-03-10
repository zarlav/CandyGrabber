namespace CandyGrabberApi.DTOs
{
    public class GameStartDTO
    {
        public int GameId { get; set; }

        public PlayerDTO Player1 { get; set; } = new PlayerDTO();
        public PlayerDTO Player2 { get; set; } = new PlayerDTO();

        public int[][] MazeLayout { get; set; } = new int[0][];
        public List<CandyDTO> Candies { get; set; } = new();
    }

    public class CandyDTO
    {
        public int X { get; set; }
        public int Y { get; set; }
    }
}
