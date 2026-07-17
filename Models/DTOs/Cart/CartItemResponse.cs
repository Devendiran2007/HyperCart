using System;

namespace HyperLocal.Models.DTOs.Cart;

public class CartItemResponse
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public decimal TotalPrice => Price * Quantity;

    public string? ImageUrl { get; set; }
}
