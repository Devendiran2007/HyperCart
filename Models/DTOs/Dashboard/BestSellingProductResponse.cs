using System;

namespace HyperLocal.Models.DTOs.Dashboard;

public class BestSellingProductResponse
{
    public Guid ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public int QuantitySold { get; set; }

    public decimal Revenue { get; set; }

    public int CurrentStock { get; set; }
}
