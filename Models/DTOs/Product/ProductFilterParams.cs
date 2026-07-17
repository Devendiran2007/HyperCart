using System;

namespace HyperLocal.Models.DTOs.Product;

public class ProductFilterParams
{
    public Guid? CategoryId { get; set; }

    public Guid? VendorId { get; set; }

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }

    public bool? InStock { get; set; }

    public string? SortBy { get; set; } // "newest", "lowest_price", "highest_price"

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 20;
}
