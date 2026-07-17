using HyperLocal.Data;
using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Product;
using HyperLocal.Models.DTOs.Search;
using HyperLocal.Models.DTOs.Vendor;
using HyperLocal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HyperLocal.Services;

public class HyperlocalSearchService : IHyperlocalSearchService
{
    private readonly ApplicationDbContext _context;

    public HyperlocalSearchService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<NearbyVendorResponse>> SearchNearbyAsync(
        double latitude,
        double longitude,
        double? radius,
        Guid? categoryId,
        string? search,
        string? sort)
    {
        // 1. Fetch all verified vendors from the database (optimized with AsNoTracking)
        var vendors = await _context.Vendors
            .AsNoTracking()
            .Where(v => v.IsVerified)
            .ToListAsync();

        // 2. Compute Haversine distances in-memory
        var nearbyVendors = vendors
            .Select(v => new
            {
                Vendor = v,
                Distance = CalculateHaversineDistance(latitude, longitude, v.Latitude, v.Longitude)
            })
            .ToList();

        // 3. Filter by delivery radius:
        // Use user-specified radius if provided, otherwise fallback to the vendor's own delivery radius
        if (radius.HasValue)
        {
            nearbyVendors = nearbyVendors.Where(nv => nv.Distance <= radius.Value).ToList();
        }
        else
        {
            nearbyVendors = nearbyVendors.Where(nv => nv.Distance <= nv.Vendor.DeliveryRadiusKm).ToList();
        }

        if (!nearbyVendors.Any())
        {
            return new List<NearbyVendorResponse>();
        }

        var nearbyVendorIds = nearbyVendors.Select(nv => nv.Vendor.Id).ToList();

        // 4. Query products for the filtered nearby vendors
        var productsQuery = _context.Products
            .AsNoTracking()
            .Include(p => p.Images)
            .Where(p => p.IsAvailable && nearbyVendorIds.Contains(p.VendorId));

        if (categoryId.HasValue)
        {
            productsQuery = productsQuery.Where(p => p.CategoryId == categoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            productsQuery = productsQuery.Where(p => p.Name.ToLower().Contains(searchLower) || p.Description.ToLower().Contains(searchLower));
        }

        var products = await productsQuery.ToListAsync();
        var productsByVendor = products.GroupBy(p => p.VendorId).ToDictionary(g => g.Key, g => g.ToList());

        // 5. Determine store open/closed status (Open standard local hours: 8:00 AM to 10:00 PM)
        var localHour = DateTime.Now.Hour;
        var isOpen = localHour >= 8 && localHour < 22;

        var searchResult = nearbyVendors
            .Select(nv =>
            {
                var vendorProducts = productsByVendor.ContainsKey(nv.Vendor.Id)
                    ? productsByVendor[nv.Vendor.Id]
                    : new List<Product>();

                return new NearbyVendorResponse
                {
                    Distance = Math.Round(nv.Distance, 2),
                    // Estimated delivery time: 20 minutes prep + 5 minutes travel time per km
                    EstimatedDeliveryTimeMinutes = 20 + (int)Math.Round(nv.Distance * 5),
                    IsOpen = isOpen,
                    Vendor = new VendorResponse
                    {
                        Id = nv.Vendor.Id,
                        UserId = nv.Vendor.UserId,
                        StoreName = nv.Vendor.StoreName,
                        Description = nv.Vendor.Description,
                        LogoUrl = nv.Vendor.LogoUrl,
                        Address = nv.Vendor.Address,
                        Latitude = nv.Vendor.Latitude,
                        Longitude = nv.Vendor.Longitude,
                        DeliveryRadiusKm = nv.Vendor.DeliveryRadiusKm,
                        IsVerified = nv.Vendor.IsVerified,
                        CreatedAt = nv.Vendor.CreatedAt
                    },
                    Products = vendorProducts.Select(p => new ProductResponse
                    {
                        Id = p.Id,
                        VendorId = p.VendorId,
                        CategoryId = p.CategoryId,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        Stock = p.Stock,
                        IsAvailable = p.IsAvailable,
                        CreatedAt = p.CreatedAt,
                        UpdatedAt = p.UpdatedAt,
                        ImageUrls = p.Images.OrderBy(i => i.DisplayOrder).Select(i => i.ImageUrl).ToList()
                    }).ToList()
                };
            })
            // If the user specifies a search query, only return vendors that have matching products
            .Where(r => r.Products.Any() || string.IsNullOrWhiteSpace(search))
            .ToList();

        // 6. Sort results
        if (string.Equals(sort, "distance", StringComparison.OrdinalIgnoreCase))
        {
            searchResult = searchResult.OrderBy(r => r.Distance).ToList();
        }
        else if (string.Equals(sort, "price_asc", StringComparison.OrdinalIgnoreCase))
        {
            searchResult = searchResult.OrderBy(r => r.Products.Any() ? r.Products.Min(p => p.Price) : decimal.MaxValue).ToList();
        }
        else if (string.Equals(sort, "price_desc", StringComparison.OrdinalIgnoreCase))
        {
            searchResult = searchResult.OrderByDescending(r => r.Products.Any() ? r.Products.Max(p => p.Price) : decimal.MinValue).ToList();
        }
        else
        {
            searchResult = searchResult.OrderBy(r => r.Distance).ToList(); // default sorting by proximity
        }

        return searchResult;
    }

    private double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
    {
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);
        var rLat1 = ToRadians(lat1);
        var rLat2 = ToRadians(lat2);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2) * Math.Cos(rLat1) * Math.Cos(rLat2);
        var c = 2 * Math.Asin(Math.Sqrt(a));
        return 6371 * c; // Earth's radius in KM (6371)
    }

    private double ToRadians(double angle)
    {
        return Math.PI * angle / 180.0;
    }
}
