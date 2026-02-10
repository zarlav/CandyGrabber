namespace CandyGrabberApi.Domain
{
    public class FriendsList
    {
        public int Id { get; private set; }
        public User? User { get; private set; }
        public int UserId { get; private set; }
        public User? Friend { get; private set; }
        public int FriendId { get; private set; }
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
