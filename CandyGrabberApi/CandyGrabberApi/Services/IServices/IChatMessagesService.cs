using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;

namespace CandyGrabberApi.Services.IServices
{
    public interface IChatMessagesService
    {
        Task SendMessage(ChatMessagesDTO message);
        Task<List<ChatMessage>> GetAllMessagesForChat(int SenderId, int RecipientId);
    }
}
