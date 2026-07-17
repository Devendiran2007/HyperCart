using System;
using System.Collections.Generic;

namespace HyperLocal.Models.DTOs.Cart;

public class CartResponse
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public List<CartItemResponse> Items { get; set; } = new();

    public decimal Subtotal { get; set; }

    public decimal Tax { get; set; }

    public decimal GrandTotal { get; set; }

    public int ItemCount { get; set; }
}
