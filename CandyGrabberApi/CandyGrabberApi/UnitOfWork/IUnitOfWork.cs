using CandyGrabberApi.Repository;
using CandyGrabberApi.Repository.IRepository;

namespace CandyGrabberApi.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IItemRepository Item { get; }
        IChatMessagesRepository ChatMessage { get; }
        IFriendsListRepository FriendsList { get; }
        IGameRepository Game { get; }
        IGameRequestRepository GameRequest { get; }
        IUserRepository User { get; }
        IPlayerRepository Player { get; }
        IFriendRequestRepository Friendrequest { get; }
        IWinnerRepository Winner { get; }
        IPlayerItemRepository PlayerItems { get; }
        IGameItemRepository GameItems { get; }

        Task Save();
    }
}
