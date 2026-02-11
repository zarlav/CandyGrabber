using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using CandyGrabberApi.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Services
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;
        private readonly ICandyRepository _candyRepository;
        private readonly IPowerUpRepository _powerUpRepository;

        public ItemService(
            IItemRepository itemRepository,
            ICandyRepository candyRepository,
            IPowerUpRepository powerUpRepository)
        {
            _itemRepository = itemRepository;
            _candyRepository = candyRepository;
            _powerUpRepository = powerUpRepository;
        }

        public async Task<IEnumerable<Item>> GetAllItemsAsync()
        {
            var query = await _itemRepository.GetAllAsync();
            return await query.ToList();
        }

        public async Task<Item?> GetItemDetailsAsync(int itemId)
        {
            try
            {
                return await _itemRepository.GetByIdAsync(itemId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<Candy?> GetCandyDetailsAsync(int itemId)
        {
            return await _candyRepository.GetByItemIdAsync(itemId);
        }

        public async Task<PowerUp?> GetPowerUpDetailsAsync(int itemId)
        {
            return await _powerUpRepository.GetByItemIdAsync(itemId);
        }
    }
}