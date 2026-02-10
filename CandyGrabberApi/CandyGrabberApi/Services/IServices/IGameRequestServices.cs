using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;

namespace CandyGrabberApi.Services.IServices
{
    public interface IGameRequestServices
    {
        Task<GameRequest> SendGameRequest(GameRequestDTO request);
        Task<Player> AcceptGameRequset(int gameRequestId);
        Task DeclineGameRequset(int gameRequestId);
        Task DeleteGameRequests(int gameId);
        Task<List<GameRequest>> GetAllGameRequestByRecipientId(int recipientId);
    }
}
