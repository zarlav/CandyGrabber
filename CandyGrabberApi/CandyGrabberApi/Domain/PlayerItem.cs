namespace CandyGrabberApi.Domain
{
    public class PlayerItem
    {
        public int Id { get; private set; }

        public int PlayerId { get; set; }
        public required Player Player { get; set; }

        public int ItemId { get; set; }
        public required Item Item { get; set; }

        public int Quantity { get; set; }
        public bool IsActive { get; set; }
        public DateTime AcquiredAt { get; set; }

        public PlayerItem() { }

        public void Activate()
        {
            IsActive = true;
        }

        public void Deactivate()
        {
            IsActive = false;
        }
    }
}