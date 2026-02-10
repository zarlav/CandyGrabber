using CandyGrabberApi.Domain.Enums;

namespace CandyGrabberApi.Models
{
    public class PowerUpModel
    {
        public int ItemId { get; set; }
        public ItemModel Item { get; set; } = null!;
        public int Duration { get; set; }
        public PowerEffect Effect { get; set; }
    }
}