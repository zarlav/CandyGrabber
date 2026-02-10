namespace CandyGrabberApi.Models
{
    public class CandyModel
    {
        public int ItemId { get; set; }
        public ItemModel Item { get; set; } = null!;
        public int Points { get; set; }
    }
}