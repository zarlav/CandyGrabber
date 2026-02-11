using System.IdentityModel.Tokens.Jwt;

namespace CandyGrabberApi.Services.IServices
{
    public interface IJWTservice
    {
        string GenerateToken(int userId, string username);
        JwtSecurityToken VerifyToken(string jwt);
        int GetUserIdFromToken(string jwt);
    }
}
