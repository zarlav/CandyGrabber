using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IGameRequestRepository : IRepository<GameRequest>
    {
        Task<GameRequest> GetGameRequestBySenderAndRecipient(int SenderId, int RecipientId);
        Task<GameRequest> GetGameRequestById(int gameRequestId);
        Task<List<GameRequest>> GetAllGameRequestByRecipientId(int recipientId);
    }
}
