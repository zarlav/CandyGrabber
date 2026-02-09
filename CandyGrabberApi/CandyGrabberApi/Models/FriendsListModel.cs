using CandyGrabberApi.Domain;

namespace CandyGrabberApi.Models
{
    public class FriendsListModel
    {
        public int Id { get; set; }
        public UserModel? User { get; set; }
        public int UserId { get; set; }
        public UserModel? Friend { get; set; }
        public int FriendId { get; set; }
    }
}
