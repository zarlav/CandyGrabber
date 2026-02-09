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
        public ICollection<FriendsListModel> SentFriendships { get; set; } = new List<FriendsListModel>();
        public ICollection<FriendsListModel> ReceivedFriendships { get; set; } = new List<FriendsListModel>();
        public ICollection<ChatMessageModel> SentMessages { get; set; } = new List<ChatMessageModel>();
        public ICollection<ChatMessageModel> ReceivedMessages { get; set; } = new List<ChatMessageModel>();
        public ICollection<GameRequestModel> SentRequests { get; set; } = new List<GameRequestModel>();
        public ICollection<GameRequestModel> ReceivedRequests { get; set; } = new List<GameRequestModel>();

    }
}
