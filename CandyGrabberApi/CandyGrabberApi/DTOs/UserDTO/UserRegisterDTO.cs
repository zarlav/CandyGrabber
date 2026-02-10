namespace CandyGrabberApi.DTOs.UserDTO
{
    public class UserRegisterDTO
    {
        public string Username { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string RepeatedPassword { get; set; } = null!;
    }
}
