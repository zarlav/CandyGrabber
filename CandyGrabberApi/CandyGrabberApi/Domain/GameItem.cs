namespace CandyGrabberApi.Domain
{
    public class GameItem
    {
        public int Id { get; private set; }
        public Item Item { get; set; } 
        public Game Game { get; set; }
        public int GameId { get; set; }
        public DateTime SpawnTime { get; set; }
        public bool IsCollected { get; private set; }
        public GameItem() { }

        public GameItem(Game game, Item item)
        {
            Game = game;
            Item = item;
            SpawnTime = DateTime.UtcNow;
            IsCollected = false;
        }

        public void Collect()
        {
            IsCollected = true;
        }
    }
}