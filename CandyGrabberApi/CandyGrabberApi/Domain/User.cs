using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CandyGrabberApi.Domain
{
    public class User
    {
        public int Id { get; private set; }

        public string Name { get; private set; }
        public string LastName { get; private set; }
        public string Username { get; private set; }
        public string PasswordHash { get; private set; }
        public int GamesWon { get; private set; }
        public int GamesLost { get; private set; }

        public ICollection<FriendsList> SentFriendships { get; } = new List<FriendsList>();
        public ICollection<FriendsList> ReceivedFriendships { get; } = new List<FriendsList>();

        public ICollection<ChatMessage> SentMessages { get; } = new List<ChatMessage>();
        public ICollection<ChatMessage> ReceivedMessages { get; } = new List<ChatMessage>();

        public ICollection<GameRequest> SentRequests { get; } = new List<GameRequest>();
        public ICollection<GameRequest> ReceivedRequests { get; } = new List<GameRequest>();

        protected User() { }

        public User(string name, string lastName, string username, string passwordHash)
        {
            Name = string.IsNullOrEmpty(name) ? throw new ArgumentException("Ime ne moze biti prazno") : name;
            LastName = string.IsNullOrEmpty(LastName) ? throw new ArgumentException("Prezime ne moze biti prazno") : LastName;
            Username = string.IsNullOrEmpty(Username) ? throw new ArgumentException("Korisnicko ime ne moze biti prazno") : Username;
            PasswordHash = string.IsNullOrEmpty(PasswordHash) ? throw new ArgumentException("Sifra ne moze biti prazna") : PasswordHash;
        }

        public void ChangeName(string newName)
        {
            if (string.IsNullOrEmpty(newName))
                throw new ArgumentException("Ime ne moze biti prazno.");
            Name = newName;
        }
        public void ChangeLastName(string newLastName)
        {
            if (string.IsNullOrEmpty(newLastName))
                throw new ArgumentException("Prezime ne moze biti prazno.");
            LastName = newLastName;
        }
        public void ChangeUserName(string newUserName)
        {
            if (string.IsNullOrEmpty(newUserName))
                throw new ArgumentException("Korisnicko ime ne moze biti prazno.");
            Username = newUserName;
        }
        public void ChangePassword(string newHash)
        {
            if (string.IsNullOrWhiteSpace(newHash))
                throw new ArgumentException("Sifra ne moze biti prazna.");
            PasswordHash = newHash;
        }
        public void AddSentFriendship(FriendsList friendship)
        {
            if (friendship == null) throw new ArgumentNullException(nameof(friendship));
            SentFriendships.Add(friendship);
        }

        public void AddReceivedFriendship(FriendsList friendship)
        {
            if (friendship == null) throw new ArgumentNullException(nameof(friendship));
            ReceivedFriendships.Add(friendship);
        }

        public void AddSentMessage(ChatMessage message)
        {
            if (message == null) throw new ArgumentNullException(nameof(message));
            SentMessages.Add(message);
        }

        public void AddReceivedMessage(ChatMessage message)
        {
            if (message == null) throw new ArgumentNullException(nameof(message));
            ReceivedMessages.Add(message);
        }

        public void AddSentRequest(GameRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            SentRequests.Add(request);
        }

        public void AddReceivedRequest(GameRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            ReceivedRequests.Add(request);
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
