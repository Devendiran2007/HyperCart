using System;
using System.Threading.Tasks;

namespace HyperLocal.Interfaces;

public interface INotificationService
{
    Task NotifyStockUpdateAsync(Guid productId, int newStock);

    Task NotifyLowStockAsync(Guid vendorId, Guid productId, string productName, int currentStock);

    Task NotifyOrderStatusUpdateAsync(Guid userId, Guid orderId, string orderNumber, string newStatus);

    Task NotifyVendorOrderCreatedAsync(Guid vendorId, Guid orderId, string orderNumber, decimal totalAmount);

    Task NotifyCustomerOrderConfirmedAsync(Guid userId, Guid orderId, string orderNumber);

    Task NotifyCartSyncAsync(Guid userId);
}
