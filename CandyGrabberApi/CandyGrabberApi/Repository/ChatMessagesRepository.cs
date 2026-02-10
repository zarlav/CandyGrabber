using CandyGrabberApi.DataContext;
using CandyGrabberApi.Domain;
using CandyGrabberApi.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CandyGrabberApi.Repository
{
    public class ChatMessagesRepository : Repository<ChatMessage>, IChatMessagesRepository
    {
        private CandyGrabberContext _db;
        public ChatMessagesRepository(CandyGrabberContext db) : base(db)
        {
            _db = db;
        }
        public async Task<List<ChatMessage>> GetChatMessagesBySenderAndRecipient(int SenderId, int RecipientId)
        {
            List<ChatMessage> messages = await _db.Messages.Where(x => x.SenderId == SenderId && x.RecipientId == RecipientId).ToListAsync();
            return messages; 
        }
    }
}
