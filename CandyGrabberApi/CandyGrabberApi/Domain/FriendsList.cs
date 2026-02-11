namespace CandyGrabberApi.Domain
{
    public class FriendsList
    {
        public int Id { get; private set; }
        public User? User { get;  set; }
        public int UserId { get;  set; }
        public User? Friend { get;  set; }
        public int FriendId { get;  set; }
        protected FriendsList() { }
        public FriendsList(int userId, int friendId)
        {
            if (userId == friendId)
                throw new ArgumentException("Korisnik ne moze biti prijatelj sa samim sobm ");
            UserId = userId;
            FriendId = friendId;
        }
    }
}
