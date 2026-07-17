using HyperLocal.Models.DTOs.Product;
using HyperLocal.Models.DTOs.Vendor;
using System.Collections.Generic;

namespace HyperLocal.Models.DTOs.Search;

public class NearbyVendorResponse
{
    public double Distance { get; set; }

    public int EstimatedDeliveryTimeMinutes { get; set; }

    public bool IsOpen { get; set; }

    public VendorResponse Vendor { get; set; } = null!;

    public List<ProductResponse> Products { get; set; } = new();
}
