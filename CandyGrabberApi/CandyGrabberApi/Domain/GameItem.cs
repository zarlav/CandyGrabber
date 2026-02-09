namespace CandyGrabberApi.Domain
{
    public class GameItem
    {
        public int Id { get; private set; }
        public required Item Item { get; set; }
        public int GameId { get; set; }
        public DateTime SpawnTime { get; set; }
        public bool IsCollected { get; private set; }
        public GameItem() { }

        public void Collect()
        {
            IsCollected = true;
        }
    }
}