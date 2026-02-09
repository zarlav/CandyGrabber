using CandyGrabberApi.Domain.Enums;

namespace CandyGrabberApi.Models
{
    public class GameModel
    {
        public int Id { get; set; }
        public int Duration { get; set; }
        public GameStatus Status { get; set; }
        public ICollection<UserModel> Players { get; set; } = new List<UserModel>();
        public ICollection<GameItemModel> GameItems { get; set; } = new List<GameItemModel>();
        public ICollection<GameRequestModel> Invitations { get; set; } = new List<GameRequestModel>();
    }
}
