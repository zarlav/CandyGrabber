namespace CandyGrabberApi.DTOs.UserDTO
{
    public class UserLoginDTO
    {
        public int Id { get; private set; }
        public string Username { get; init; } = String.Empty;
        public string Password { get; init; } = String.Empty;
    }
}
