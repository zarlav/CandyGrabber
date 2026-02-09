using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Models
{
    public class GameRequestModel
    {
        public int Id { get; set; }
        public UserModel? Sender { get; set; }
        public int SenderId { get; set; }
        public UserModel? Recipient { get; set; }
        public int RecipientId { get; set; }
        public UserModel? Game { get; set; }
        public int GameId { get; set; }
        public DateTime TimeStamp { get; set; }
    }
}
