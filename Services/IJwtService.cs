using HyperLocal.Models.Entities;

namespace HyperLocal.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}