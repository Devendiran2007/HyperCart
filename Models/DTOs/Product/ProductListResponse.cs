using System.Collections.Generic;

namespace HyperLocal.Models.DTOs.Product;

public class ProductListResponse
{
    public int TotalCount { get; set; }

    public int CurrentPage { get; set; }

    public int PageSize { get; set; }

    public List<ProductResponse> Items { get; set; } = new();
}
