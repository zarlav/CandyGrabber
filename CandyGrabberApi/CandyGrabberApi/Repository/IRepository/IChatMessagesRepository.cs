using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Repository.IRepository
{
    public interface IChatMessagesRepository : IRepository<ChatMessage>
    {
        Task<List<ChatMessage>> GetChatMessagesBySenderAndRecipient(int SenderId, int RecipientId);
    }
}
