using CandyGrabberApi.Services.IServices;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CandyGrabberApi.Services
    {
        public class JWTservice : IJWTservice
        {
        private readonly string _secureKey;

        public JWTservice(IConfiguration configuration)
        {
            _secureKey = configuration["Jwt:SecretKey"];
            if (string.IsNullOrEmpty(_secureKey))
                throw new Exception("JWT SecretKey is not configured!");
        }
        public string GenerateToken(int userId, string username)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secureKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim("id", userId.ToString()),
                new Claim(ClaimTypes.Name, username)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1), 
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public JwtSecurityToken VerifyToken(string jwt)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secureKey);

            tokenHandler.ValidateToken(jwt, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false, 
                ValidateAudience = false, 
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return (JwtSecurityToken)validatedToken;
        }
        public int GetUserIdFromToken(string jwt)
        {
            var token = VerifyToken(jwt);
            var idClaim = token.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (idClaim == null)
                throw new Exception("Invalid token");
            return int.Parse(idClaim);
        }
    }
}

