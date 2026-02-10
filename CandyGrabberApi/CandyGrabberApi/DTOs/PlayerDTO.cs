namespace CandyGrabberApi.DTOs
{
    public class PlayerDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Username { get; set; }
        public int GameId { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Points { get; set; }
    }
}