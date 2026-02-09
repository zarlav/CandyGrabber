namespace CandyGrabberApi.Domain
{
    public class PlayerItem
    {
        public int Id { get; private set; }
        public required Player Player { get; set; }
        public required Item Item { get; set; }
        public int Quantity { get; set; }
        public bool IsActive { get; set; }
        public DateTime AcquiredAt { get; set; }
        public PlayerItem() { }
    }
}