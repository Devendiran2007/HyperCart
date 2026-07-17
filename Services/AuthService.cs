using HyperLocal.Data;
using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs;
using HyperLocal.Models.Entities;
using HyperLocal.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace HyperLocal.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthService(ApplicationDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var exists = await _context.Users
            .AnyAsync(x => x.Email == request.Email);

        if (exists)
            throw new Exception("Email already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = Role.Customer
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new Exception("Invalid email or password.");

        var token = _jwtService.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };
    }
}
