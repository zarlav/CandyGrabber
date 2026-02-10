using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;

namespace CandyGrabberApi.Services.IServices
{
    public interface IGameRequestServices
    {
        Task<GameRequest> SendGameRequest(GameRequestDTO request);
        Task<Player> AcceptGameRequest(int gameRequestId);
        Task DeclineGameRequest(int gameRequestId);
        Task DeleteGameRequests(int gameId);
        Task<List<GameRequest>> GetAllGameRequestByRecipientId(int recipientId);
    }
}
