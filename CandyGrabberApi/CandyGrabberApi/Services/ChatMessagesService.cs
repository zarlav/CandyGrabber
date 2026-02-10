using CandyGrabberApi.DataContext;
using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;

namespace CandyGrabberApi.Services
{
    public class ChatMessagesService : IChatMessagesService
    {
        private readonly CandyGrabberContext _db;
        public IUnitOfWork _unitOfWork { get; set; }
        public ChatMessagesService(CandyGrabberContext db, IUnitOfWork unitOfWork)
        {
            this._db = db;
            this._unitOfWork = unitOfWork;
        }
        public async Task<List<ChatMessage>> GetAllMessagesForChat(int SenderId, int RecipientId)
        {
            List<ChatMessage> messages = await this._unitOfWork.ChatMessage.GetChatMessagesBySenderAndRecipient(SenderId, RecipientId);
            return messages;
        }

        public async Task SendMessage(ChatMessagesDTO message)
        {
            if (message != null)
            {
                var messageCreated = new ChatMessage(message.SenderId, message.RecipientId, message.Content);
                await _unitOfWork.ChatMessage.Add(messageCreated);
                await _unitOfWork.Save();
            }
        }
    }
}
