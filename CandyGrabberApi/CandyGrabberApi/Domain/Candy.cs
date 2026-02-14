namespace CandyGrabberApi.Domain
{
    public class Candy
    {
        public int ItemId { get;  set; }
        public int Points { get; set; }

        protected Candy() { }

        public Candy(int points)
        {
            Points = points;
        }
    }
}