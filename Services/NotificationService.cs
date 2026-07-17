using HyperLocal.Hubs;
using HyperLocal.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace HyperLocal.Services;

public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyStockUpdateAsync(Guid productId, int newStock)
    {
        await _hubContext.Clients.All.SendAsync("OnStockUpdated", new { ProductId = productId, NewStock = newStock });
    }

    public async Task NotifyLowStockAsync(Guid vendorId, Guid productId, string productName, int currentStock)
    {
        await _hubContext.Clients.Group($"Vendor_{vendorId}").SendAsync("OnLowStockAlert", new
        {
            ProductId = productId,
            ProductName = productName,
            CurrentStock = currentStock
        });
    }

    public async Task NotifyOrderStatusUpdateAsync(Guid userId, Guid orderId, string orderNumber, string newStatus)
    {
        await _hubContext.Clients.Group($"Customer_{userId}").SendAsync("OnOrderStatusUpdated", new
        {
            OrderId = orderId,
            OrderNumber = orderNumber,
            Status = newStatus
        });
    }

    public async Task NotifyVendorOrderCreatedAsync(Guid vendorId, Guid orderId, string orderNumber, decimal totalAmount)
    {
        await _hubContext.Clients.Group($"Vendor_{vendorId}").SendAsync("OnOrderCreated", new
        {
            OrderId = orderId,
            OrderNumber = orderNumber,
            TotalAmount = totalAmount
        });
    }

    public async Task NotifyCustomerOrderConfirmedAsync(Guid userId, Guid orderId, string orderNumber)
    {
        await _hubContext.Clients.Group($"Customer_{userId}").SendAsync("OnOrderConfirmed", new
        {
            OrderId = orderId,
            OrderNumber = orderNumber
        });
    }

    public async Task NotifyCartSyncAsync(Guid userId)
    {
        await _hubContext.Clients.Group($"Customer_{userId}").SendAsync("OnCartSynced");
    }
}
