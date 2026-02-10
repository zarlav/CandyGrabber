using CandyGrabberApi.Domain.Enums;

namespace CandyGrabberApi.Models
{
    public class ItemModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public ItemType Type { get; set; }
        public CandyModel? Candy { get; set; }
        public PowerUpModel? PowerUp { get; set; }
    }
}