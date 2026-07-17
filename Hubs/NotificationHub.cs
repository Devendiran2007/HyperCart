using HyperLocal.Data;
using HyperLocal.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HyperLocal.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private readonly ApplicationDbContext _context;
    private readonly IConnectionManager _connectionManager;

    public NotificationHub(ApplicationDbContext context, IConnectionManager connectionManager)
    {
        _context = context;
        _connectionManager = connectionManager;
    }

    public override async Task OnConnectedAsync()
    {
        var userIdString = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(userIdString, out var userId))
        {
            _connectionManager.AddConnection(userIdString, Context.ConnectionId);

            // Group: Customer_{CustomerId}
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Customer_{userId}");

            // Group: Vendor_{VendorId}
            var vendor = await _context.Vendors.AsNoTracking().FirstOrDefaultAsync(v => v.UserId == userId);
            if (vendor != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"Vendor_{vendor.Id}");
            }
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _connectionManager.RemoveConnection(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}
