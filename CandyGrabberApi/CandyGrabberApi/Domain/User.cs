using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CandyGrabberApi.Domain
{
    public class User
    {
        public int Id { get; private set; }

        public required string Name { get; set; }
        public required string LastName { get; set; }
        public required string Username { get; set; }

        public required string PasswordHash { get; set; }

        public int GamesWon { get; private set; }
        public int GamesLost { get; private set; }

        public ICollection<FriendsList> SentFriendships { get; } = new List<FriendsList>();
        public ICollection<FriendsList> ReceivedFriendships { get; } = new List<FriendsList>();

        public ICollection<ChatMessage> SentMessages { get; } = new List<ChatMessage>();
        public ICollection<ChatMessage> ReceivedMessages { get; } = new List<ChatMessage>();

        public ICollection<Request> SentRequests { get; } = new List<Request>();
        public ICollection<Request> ReceivedRequests { get; } = new List<Request>();

        protected User() { }

        public User(string name, string lastName, string username, string passwordHash)
        {
            Name = name;
            LastName = lastName;
            Username = username;
            PasswordHash = passwordHash;
        }

        public void RegisterWin()
        {
            GamesWon++;
        }
        public void RegisterLoss()
        {
            GamesLost++;
        }
    }

}
