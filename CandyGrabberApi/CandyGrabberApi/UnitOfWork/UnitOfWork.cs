using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;
using CandyGrabberApi.Repository;
using CandyGrabberApi.Repository.IRepository;

namespace CandyGrabberApi.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly CandyGrabberContext _context;
        public UnitOfWork(CandyGrabberContext context)
        {
            _context = context;
            Item = new ItemRepository(_context);
            ChatMessage = new ChatMessagesRepository(_context);
            FriendsList = new FriendsListRepository(_context);
            Game = new GameRepository(_context);
            GameRequest = new GameRequestRepository(_context);
            User = new UserRepository(_context);
            Player = new PlayerRepository(_context);
            Winner = new WinnerRepository(_context);
            PlayerItems = new PlayerItemRepository(_context);
            GameItems = new GameItemRepository(_context);
            Friendrequest = new FriendRequestRepository(_context);

        }
        public IItemRepository Item { get; private set; }

        public IChatMessagesRepository ChatMessage { get; private set; }

        public IFriendsListRepository FriendsList { get; private set; }

        public IGameRepository Game { get; private set; }

        public IGameRequestRepository GameRequest { get; private set; }

        public IUserRepository User { get; private set; }

        public IPlayerRepository Player { get; private set; }

        public IFriendRequestRepository Friendrequest { get; private set; }

        public IWinnerRepository Winner { get; private set; }

        public IPlayerItemRepository PlayerItems { get; private set; }

        public IGameItemRepository GameItems { get; private set; }

        public void Dispose()
        {
            _context.Dispose();
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }
    }
}
