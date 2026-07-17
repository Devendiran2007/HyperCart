using HyperLocal.Models.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HyperLocal.Interfaces;

public interface IOrderService
{
    Task<OrderResponse> CheckoutAsync(Guid userId, CheckoutRequest request);

    Task<List<OrderResponse>> GetOrdersAsync(Guid userId, string role);

    Task<OrderResponse?> GetOrderByIdAsync(Guid userId, string role, Guid orderId);

    Task<OrderResponse> CancelOrderAsync(Guid userId, string role, Guid orderId);
}
