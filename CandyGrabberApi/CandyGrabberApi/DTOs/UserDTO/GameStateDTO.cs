namespace CandyGrabberApi.DTOs.UserDTO
{
    public class GameStateDTO
    {
        public int GameId { get; set; }
        public Dictionary<int, float> PlayerX { get; set; } = new();
        public Dictionary<int, float> PlayerY { get; set; } = new();
        public Dictionary<int, int> Scores { get; set; } = new();
        public List<bool> CandiesCollected { get; set; } = new();
        public int TotalCandies { get; set; }
        public int[][] MazeLayout { get; set; } = Array.Empty<int[]>();
        public List<CandyDTO> Candies { get; set; } = new();
    }
}
