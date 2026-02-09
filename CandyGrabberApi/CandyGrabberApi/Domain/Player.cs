namespace CandyGrabberApi.Domain
{
    public class Player
    {
        public int Id { get; private set; }
        public required User User { get; set; }
        public required Game Game { get; set; }
        public ICollection<PlayerItem> PlayerItems { get; } = new List<PlayerItem>();

        public Player() { }

        public void AddToInventory(Item item, int quantity)
        {
            var newItem = new PlayerItem
            {
                Player = this, 
                Item = item, 
                Quantity = quantity,
                AcquiredAt = DateTime.Now,
                IsActive = false
            };
            PlayerItems.Add(newItem);
        }
    }
}