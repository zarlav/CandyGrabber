using CandyGrabberApi.Domain.Enums;

namespace CandyGrabberApi.Domain
{
    public class Game
    {
        private readonly object _state = new();
        public int Id { get; set; }
        public ICollection<User> Players { get; private set; } = new List<User>();
        public int Duration { get;private set; }
        public ICollection<GameItem> GameItems { get; private set; } = new List<GameItem>();
        public GameStatus Status { get; private set; }
        public ICollection<GameRequest> Invitations { get; set; } = new List<GameRequest>();
        protected Game() { }
        public Game(int duration)
        {
            Duration = duration;
            Status = GameStatus.Created;
        }
        public void Start()
        {
            lock (_state)
            {
                if (Status != GameStatus.Countdown)
                    throw new InvalidOperationException($"Nije moguce startovati matching iz stanja: {Status}.");
                Status = GameStatus.InProgress;
            }
        }
        public void GoToLoby()
        {
            lock (_state)
            {
                if (Status != GameStatus.Created)
                    throw new InvalidOperationException($"Nije moguce uci u lobby iz stanja: {Status}.");
                Status = GameStatus.Lobby;
            }
        }
        public void StartCountdown()
        {
            lock (_state)
            {
                if (Status != GameStatus.Lobby)
                    throw new InvalidOperationException($"Nije moguce pokrenuti countdown iz stanja: {Status}.");
                if (Players.Count < 2)
                    throw new InvalidOperationException("Nema dovoljno igraca za kreiranje runde!");
                Status = GameStatus.Countdown;
            }
        }
        public void CancelMatching()
        {
            lock (_state)
            {
                if (Status != GameStatus.Lobby &&
                    Status != GameStatus.Countdown)
                    throw new InvalidOperationException($"Nije moguce prekinuti matching iz stanja: {Status}.");
                Status = GameStatus.Canceled;
            }
        }
        public void Finish()
        {
            lock (_state)
            {
                if (Status != GameStatus.InProgress &&
                    Status != GameStatus.Paused &&
                    Status != GameStatus.WaitingForReconnect)
                    throw new InvalidOperationException($"Nije moguce zavrsiti igru iz stanja: {Status}.");
                Status = GameStatus.Finished;
            }
        }
        public void Pause()
        {
            lock (_state)
            {
                if (Status != GameStatus.InProgress)
                    throw new InvalidOperationException($"Nije moguce pauzirati igru iz stanja: {Status}.");
                Status = GameStatus.Paused;
            }
        }
        public void Resume()
        {
            lock (_state)
            {
                if (Status != GameStatus.Paused &&
                    Status != GameStatus.WaitingForReconnect)
                    throw new InvalidOperationException($"Nije moguce nastaviti igru iz stanja: {Status}.");
                Status = GameStatus.InProgress;
            }
        }

        public void WaitForReconnect()
        {
            lock (_state)
            {
                if (Status != GameStatus.InProgress)
                    throw new InvalidOperationException($"Rekonekcija nije moguca iz stanja: {Status}.");
                Status = GameStatus.WaitingForReconnect;
            }
        }
    }
}
