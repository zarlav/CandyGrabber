using System.Text.Json.Serialization;

namespace CandyGrabberApi.DTOs.UserDTO
{
    public class UserUpdateDTO
    {
        [JsonIgnore]
        public int Id { get; init; }
        public string Username { get; init; }
        public string Name { get; init; }
        public string LastName { get; init; }
        public bool ChangePassword { get; init; }
        public string? OldPassword { get; init; }
        public string? NewPassword { get; init; }
    }
}
