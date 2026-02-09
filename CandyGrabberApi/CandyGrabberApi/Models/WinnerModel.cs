using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Models
{
    public class WinnerModel
    {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public PlayerModel? Player { get; set; }
    }
}
