namespace CandyGrabberApi.Models
{
    public class PlayerItemModel
    {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public PlayerModel Player { get; set; } = null!;
        public int ItemId { get; set; }
        public ItemModel Item { get; set; } = null!;
        public int Quantity { get; set; }
        public bool IsActive { get; set; }
        public DateTime AcquiredAt { get; set; }
    }
}