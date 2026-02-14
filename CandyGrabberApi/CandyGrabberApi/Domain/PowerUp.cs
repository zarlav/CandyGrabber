using CandyGrabberApi.Domain.Enums;

namespace CandyGrabberApi.Domain
{
    public class PowerUp
    {
        public int ItemId { get;  set; }
        public int Duration { get; set; }
        public PowerEffect Effect { get; set; }
        protected PowerUp() { }
        public PowerUp(int duration, PowerEffect effect)
        {
            Duration = duration;
            Effect = effect;
        }
    }
}