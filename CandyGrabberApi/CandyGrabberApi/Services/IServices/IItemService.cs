using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Services.IServices
{
    public interface IItemService
    {
        Task<IEnumerable<Item>> GetAllItemsAsync();
        Task<Item?> GetItemDetailsAsync(int itemId);
        Task<Candy?> GetCandyDetailsAsync(int itemId);
        Task<PowerUp?> GetPowerUpDetailsAsync(int itemId);
    }
}