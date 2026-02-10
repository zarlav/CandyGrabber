namespace CandyGrabberApi.Models
{
    public class GameItemModel
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public ItemModel Item { get; set; } = null!;
        public int GameId { get; set; }
        public GameModel Game { get; set; } = null!;
        public DateTime SpawnTime { get; set; }
        public bool IsCollected { get; set; }
    }
}