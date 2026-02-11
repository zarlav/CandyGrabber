using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Services.IServices
{
    public interface IGameService
    {
        Task<Game> CreateGame(int duration);
    }
}
