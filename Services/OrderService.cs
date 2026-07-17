using HyperLocal.Data;
using HyperLocal.Helpers;
using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Order;
using HyperLocal.Models.Entities;
using HyperLocal.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HyperLocal.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;
    private readonly INotificationService _notificationService;

    public OrderService(ApplicationDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<OrderResponse> CheckoutAsync(Guid userId, CheckoutRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        // Run entire checkout process inside an EF Core transaction
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .ThenInclude(p => p.Vendor)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.CartItems.Any())
            {
                throw new InvalidOperationException("Cannot checkout. Your shopping cart is empty.");
            }

            // Verify each item for active status, verified vendor, and stock
            foreach (var item in cart.CartItems)
            {
                var product = item.Product;
                if (product == null)
                {
                    throw new InvalidOperationException($"Product with ID {item.ProductId} no longer exists.");
                }

                if (!product.IsAvailable)
                {
                    throw new InvalidOperationException($"Product '{product.Name}' is currently inactive.");
                }

                if (product.Vendor == null || !product.Vendor.IsVerified)
                {
                    throw new InvalidOperationException($"Vendor for product '{product.Name}' is unverified.");
                }

                if (item.Quantity > product.Stock)
                {
                    throw new InvalidOperationException($"Insufficient stock for product '{product.Name}'. Requested: {item.Quantity}, Available: {product.Stock}");
                }

                // Deduct stock atomically
                product.Stock -= item.Quantity;
            }

            // Calculate Order Totals (Subtotal + 10% Tax)
            var subtotal = cart.CartItems.Sum(ci => ci.Product.Price * ci.Quantity);
            var tax = Math.Round(subtotal * 0.10M, 2);
            var totalAmount = subtotal + tax;

            // Generate Sequential Order Number (format: HC-yyyy-000001)
            var currentYear = DateTime.UtcNow.Year;
            var prefix = $"HC-{currentYear}-";
            
            var lastOrderNumber = await _context.Orders
                .Where(o => o.OrderNumber.StartsWith(prefix))
                .OrderByDescending(o => o.OrderNumber)
                .Select(o => o.OrderNumber)
                .FirstOrDefaultAsync();

            int nextSeq = 1;
            if (lastOrderNumber != null)
            {
                var seqPart = lastOrderNumber.Substring(prefix.Length);
                if (int.TryParse(seqPart, out var lastSeq))
                {
                    nextSeq = lastSeq + 1;
                }
            }

            var orderNumber = $"{prefix}{nextSeq:D6}";

            // Create Order
            var order = new Order
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                OrderNumber = orderNumber,
                TotalAmount = totalAmount,
                Status = OrderStatus.Pending,
                PaymentStatus = PaymentStatus.Pending,
                ShippingAddress = request.ShippingAddress,
                PaymentMethod = request.PaymentMethod,
                CreatedAt = DateTime.UtcNow
            };

            // Copy cart items to order items
            foreach (var item in cart.CartItems)
            {
                order.OrderItems.Add(new OrderItem
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Product.Price
                });
            }

            _context.Orders.Add(order);

            // Clear Cart Items after checkout
            _context.CartItems.RemoveRange(cart.CartItems);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            try
            {
                foreach (var item in cart.CartItems)
                {
                    if (item.Product != null)
                    {
                        await _notificationService.NotifyStockUpdateAsync(item.ProductId, item.Product.Stock);
                        if (item.Product.Stock < 10)
                        {
                            await _notificationService.NotifyLowStockAsync(item.Product.VendorId, item.ProductId, item.Product.Name, item.Product.Stock);
                        }
                    }
                }

                var itemsByVendor = cart.CartItems.GroupBy(ci => ci.Product.VendorId);
                foreach (var group in itemsByVendor)
                {
                    var vendorId = group.Key;
                    var vendorTotal = group.Sum(ci => ci.Quantity * ci.Product.Price);
                    await _notificationService.NotifyVendorOrderCreatedAsync(vendorId, order.Id, order.OrderNumber, vendorTotal);
                }

                await _notificationService.NotifyOrderStatusUpdateAsync(userId, order.Id, order.OrderNumber, order.Status.ToString());
            }
            catch
            {
                // Silently catch notification errors to avoid failing checkout after successful DB commit
            }

            // Return response DTO
            return new OrderResponse
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                ShippingAddress = order.ShippingAddress,
                PaymentMethod = order.PaymentMethod,
                CreatedAt = order.CreatedAt,
                Items = order.OrderItems.Select(oi => new OrderItemResponse
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList()
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<List<OrderResponse>> GetOrdersAsync(Guid userId, string role)
    {
        var query = _context.Orders.AsNoTracking().AsQueryable();

        // 1. Filter orders based on user roles
        if (string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            // Admin sees all orders
        }
        else if (string.Equals(role, "Vendor", StringComparison.OrdinalIgnoreCase))
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == userId);
            if (vendor == null)
            {
                return new List<OrderResponse>();
            }

            // Vendor only sees orders containing their products
            query = query.Where(o => o.OrderItems.Any(oi => oi.Product.VendorId == vendor.Id));
        }
        else
        {
            // Customers see only their own orders
            query = query.Where(o => o.UserId == userId);
        }

        // 2. Select and project
        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        var responseList = new List<OrderResponse>();

        foreach (var order in orders)
        {
            var itemsQuery = _context.OrderItems
                .AsNoTracking()
                .Where(oi => oi.OrderId == order.Id);

            // Filter items based on Vendor role
            if (string.Equals(role, "Vendor", StringComparison.OrdinalIgnoreCase))
            {
                var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == userId);
                if (vendor != null)
                {
                    itemsQuery = itemsQuery.Where(oi => oi.Product.VendorId == vendor.Id);
                }
            }

            var items = await itemsQuery
                .Select(oi => new OrderItemResponse
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                })
                .ToListAsync();

            // Total amount for vendor should reflect their own revenue or full order amount.
            // Returning the full order total is standard, but keeping the response correct for their view.
            responseList.Add(new OrderResponse
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                ShippingAddress = order.ShippingAddress,
                PaymentMethod = order.PaymentMethod,
                CreatedAt = order.CreatedAt,
                Items = items
            });
        }

        return responseList;
    }

    public async Task<OrderResponse?> GetOrderByIdAsync(Guid userId, string role, Guid orderId)
    {
        var order = await _context.Orders
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            throw new KeyNotFoundException($"Order with ID {orderId} was not found.");
        }

        // Verify visibility based on roles
        if (string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            // Admin can see everything
        }
        else if (string.Equals(role, "Vendor", StringComparison.OrdinalIgnoreCase))
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == userId);
            if (vendor == null)
            {
                throw new UnauthorizedAccessException("Logged-in user is not associated with any vendor profile.");
            }

            var hasVendorItems = await _context.OrderItems
                .AnyAsync(oi => oi.OrderId == orderId && oi.Product.VendorId == vendor.Id);

            if (!hasVendorItems)
            {
                throw new UnauthorizedAccessException("Vendors can only view orders containing their own products.");
            }
        }
        else
        {
            // Customer can only view their own orders
            if (order.UserId != userId)
            {
                throw new UnauthorizedAccessException("You can only view your own orders.");
            }
        }

        var itemsQuery = _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.OrderId == order.Id);

        if (string.Equals(role, "Vendor", StringComparison.OrdinalIgnoreCase))
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == userId);
            if (vendor != null)
            {
                itemsQuery = itemsQuery.Where(oi => oi.Product.VendorId == vendor.Id);
            }
        }

        var items = await itemsQuery
            .Select(oi => new OrderItemResponse
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.Product.Name,
                Quantity = oi.Quantity,
                Price = oi.Price
            })
            .ToListAsync();

        return new OrderResponse
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            UserId = order.UserId,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            PaymentStatus = order.PaymentStatus,
            ShippingAddress = order.ShippingAddress,
            PaymentMethod = order.PaymentMethod,
            CreatedAt = order.CreatedAt,
            Items = items
        };
    }

    public async Task<OrderResponse> CancelOrderAsync(Guid userId, string role, Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            throw new KeyNotFoundException($"Order with ID {orderId} was not found.");
        }

        // Authorization checks
        if (string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            // Admin can cancel anything
        }
        else if (string.Equals(role, "Vendor", StringComparison.OrdinalIgnoreCase))
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == userId);
            if (vendor == null)
            {
                throw new UnauthorizedAccessException("Logged-in user is not associated with any vendor profile.");
            }

            var hasVendorItems = order.OrderItems.Any(oi => oi.Product.VendorId == vendor.Id);
            if (!hasVendorItems)
            {
                throw new UnauthorizedAccessException("Vendors can only cancel orders containing their own products.");
            }
        }
        else
        {
            // Customer can only cancel their own order
            if (order.UserId != userId)
            {
                throw new UnauthorizedAccessException("You can only cancel your own orders.");
            }

            // Customer can only cancel pending orders
            if (order.Status != OrderStatus.Pending)
            {
                throw new InvalidOperationException("Customers can only cancel orders that are still pending.");
            }
        }

        if (order.Status == OrderStatus.Cancelled)
        {
            throw new InvalidOperationException("This order is already cancelled.");
        }

        // Restoring stock inside transaction
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            order.Status = OrderStatus.Cancelled;
            order.PaymentStatus = PaymentStatus.Refunded;

            foreach (var item in order.OrderItems)
            {
                if (item.Product != null)
                {
                    item.Product.Stock += item.Quantity;
                    item.Product.IsAvailable = true; // reactivate if it was inactive due to zero stock
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            try
            {
                foreach (var item in order.OrderItems)
                {
                    if (item.Product != null)
                    {
                        await _notificationService.NotifyStockUpdateAsync(item.ProductId, item.Product.Stock);
                    }
                }

                await _notificationService.NotifyOrderStatusUpdateAsync(order.UserId, order.Id, order.OrderNumber, OrderStatus.Cancelled.ToString());
            }
            catch
            {
                // Silently catch notification errors to avoid failing cancellation after successful DB commit
            }
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }

        // Return updated order view projected correctly
        var updatedResponse = await GetOrderByIdAsync(userId, role, orderId);
        return updatedResponse!;
    }
}
