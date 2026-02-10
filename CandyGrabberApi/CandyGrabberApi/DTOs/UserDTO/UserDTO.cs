namespace CandyGrabberApi.DTOs.UserDTO
{
    public class UserDTO
    {
        public int Id { get; init; }
        public string Username { get; init; } = null!;
        public string Name { get; init; } = null!;
        public string LastName { get; init; } = null!;
        public int GamesWon { get; init; }
        public int GamesLost { get; init; }

        public UserDTO(int id, string username, string name, string lastName, int gamesWon, int gamesLost)
        {
            Id = id;
            Username = username;
            Name = name;
            LastName = lastName;
            GamesWon = gamesWon;
            GamesLost = gamesLost;
        }
    }
}
