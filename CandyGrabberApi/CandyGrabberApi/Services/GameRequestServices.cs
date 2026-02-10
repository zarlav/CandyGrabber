using CandyGrabberApi.DataContext;
using CandyGrabberApi.Domain;
using CandyGrabberApi.DTOs;
using CandyGrabberApi.Services.IServices;
using CandyGrabberApi.UnitOfWork;

namespace CandyGrabberApi.Services
{
    public class GameRequestServices : IGameRequestServices
    {
        private readonly CandyGrabberContext _db;
        public IUnitOfWork _unitOfWork { get; set; }
        public IPlayerService _playerService { get; set; }
        public async Task<Player> AcceptGameRequset(int gameRequestId)
        {
            var request = await _unitOfWork.GameRequest.GetGameRequestById(gameRequestId);

            if (request == null)
                throw new KeyNotFoundException("Game request not found.");
            var player = await _playerService.CreatePlayer(request.RecipientId, request.GameId);         // cekam ICreatePlayerService
            request.SetGameRequestStatusToAccepted();
            await _unitOfWork.Save();

            return player;
        }

        public async Task DeclineGameRequset(int gameRequestId)
        {
            var request = await _unitOfWork.GameRequest.GetGameRequestById(gameRequestId);

            if (request == null)
                throw new KeyNotFoundException("Game request not found.");

            request.SetGameRequestStatusToDeclined();
            await _unitOfWork.Save();
        }

        public async Task DeleteGameRequests(int gameId)
        {
            try
            {
                var requests = await this._unitOfWork.GameRequest.GetGameRequests(gameId);
                if (requests != null)
                {
                    foreach (GameRequest request in requests)
                    {
                        this._unitOfWork.GameRequest.Delete(request);
                    }
                    await _unitOfWork.Save();
                }
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<GameRequest>> GetAllGameRequestByRecipientId(int recipientId)
        {
            try
            {
                return await _unitOfWork.GameRequest.GetAllGameRequestByRecipientId(recipientId);
            }
            catch
            {
                throw;
            }
        }

        public async Task<GameRequest> SendGameRequest(GameRequestDTO request)
        {
            if (request != null)
            {
                var requestFound = await this._unitOfWork.GameRequest.GetGameRequestBySenderAndRecipient(request.SenderId, request.RecipientId, request.GameId);
                if (requestFound != null)
                {
                    return null;
                }
                var requestCreated = new GameRequest(request.SenderId, request.RecipientId, request.GameId, request.Timestamp);
                requestCreated.SetGameRequestStatusToSent();
                await _unitOfWork.GameRequest.Add(requestCreated);
                await _unitOfWork.Save();

                return requestCreated;
            }
            else
            {
                return null;
            }
        }
    }
}
