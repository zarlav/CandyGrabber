using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int GamesWon { get; set; }
        public int GamesLost { get; set; }
        public virtual ICollection<FriendsListModel> FriendFriendsLists { get; set; } = new List<FriendsListModel>();

        public virtual ICollection<FriendsListModel> InitiatorFriendsLists { get; set; } = new List<FriendsListModel>();
        public ICollection<FriendRequestModel> SenderRequests { get; set; } = new List<FriendRequestModel>();
        public ICollection<FriendRequestModel> RecipientRequests { get; set; } = new List<FriendRequestModel>();
        public ICollection<ChatMessageModel> SenderLists { get; set; } = new List<ChatMessageModel>();
        public ICollection<ChatMessageModel> RecipientLists { get; set; } = new List<ChatMessageModel>();
        public ICollection<GameRequestModel> SenderGameInvitations { get; set; } = new List<GameRequestModel>();
        public ICollection<GameRequestModel> RecipientGameInvitations { get; set; } = new List<GameRequestModel>();

    }
}
