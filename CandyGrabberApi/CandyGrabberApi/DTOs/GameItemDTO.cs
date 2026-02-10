namespace CandyGrabberApi.DTOs
{
    public class GameItemDTO
    {
        public int Id { get; set; }
        public string? ItemName { get; set; }
        public string? ItemType { get; set; } 
        public bool IsCollected { get; set; }
    }
}
