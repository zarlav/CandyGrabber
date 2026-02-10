namespace CandyGrabberApi.DTOs
{
    public class GameItemDTO
    {
        public int Id { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public string? ItemName { get; set; }
        public string? ItemType { get; set; } 
        public bool IsCollected { get; set; }
    }
}
