using CandyGrabberApi.Domain.Enums;

namespace CandyGrabberApi.Domain
{
    public class Item
    {
        public int Id { get; private set; }
        public string Name { get; set; }
        public ItemType Type { get; set; }
        protected Item() { }

        public Item(string name, ItemType type)
        {
            Name = name;
            Type = type;
        }
    }
}