using System;
using System.Collections.Generic;

namespace HyperLocal.Models.DTOs.Product;

public class ProductResponse
{
    public Guid Id { get; set; }

    public Guid VendorId { get; set; }

    public Guid CategoryId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Stock { get; set; }

    public bool IsAvailable { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public List<string> ImageUrls { get; set; } = new();
}
