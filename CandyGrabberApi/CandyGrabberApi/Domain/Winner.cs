namespace CandyGrabberApi.Domain
{
    public class Winner
    {
        public int Id { get; protected set; }
        public int PlayerId { get; protected set; }
        public Player? Player { get; protected set; }
        protected Winner() { }
        public Winner(int PlayerId)
        {
            this.PlayerId = PlayerId;
        }
    }
}
