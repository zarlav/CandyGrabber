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
        public FriendsList(User user, User friend)
        {
            User = user ?? throw new ArgumentNullException(nameof(user));
            Friend = friend ?? throw new ArgumentNullException(nameof(friend));
            if (user.Id == friend.Id)
                throw new ArgumentException("Korisnik ne moze biti prijatelj sa samim sobm ");
            UserId = User.Id;
            FriendId = Friend.Id;
        }
    }
}
