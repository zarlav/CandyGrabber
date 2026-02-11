namespace CandyGrabberApi.DTOs.UserDTO
{
    public class UserRegisterDTO
    {
        public string Username { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string RepeatedPassword { get; set; } = string.Empty;
    }
}
