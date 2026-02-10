namespace CandyGrabberApi.Models
{
    public class PlayerModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public UserModel User { get; set; } = null!;
        public int GameId { get; set; }
        public GameModel Game { get; set; } = null!;

        public ICollection<PlayerItemModel> PlayerItems { get; set; } = new List<PlayerItemModel>();
    }
}