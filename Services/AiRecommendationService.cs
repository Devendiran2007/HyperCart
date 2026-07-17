using HyperLocal.Data;
using HyperLocal.Helpers;
using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Product;
using HyperLocal.Models.Entities;
using HyperLocal.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace HyperLocal.Services;

public class AiRecommendationService : IAiRecommendationService
{
    private readonly ApplicationDbContext _context;
    private readonly INvidiaAiService _aiService;

    public AiRecommendationService(ApplicationDbContext context, INvidiaAiService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    private async Task<List<ProductResponse>> ProjectProductsAsync(IQueryable<Product> query)
    {
        return await query
            .Select(p => new ProductResponse
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
            })
            .ToListAsync();
    }

    public async Task<List<ProductResponse>> GetSimilarProductsAsync(Guid productId, int limit = 5)
    {
        var mainProduct = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (mainProduct == null)
        {
            throw new KeyNotFoundException($"Product with ID {productId} was not found.");
        }

        // Fetch candidates in the same category
        var candidates = await _context.Products
            .AsNoTracking()
            .Where(p => p.Id != productId && p.CategoryId == mainProduct.CategoryId && p.IsAvailable)
            .Take(15)
            .ToListAsync();

        if (!candidates.Any())
        {
            return new List<ProductResponse>();
        }

        var candidateData = string.Join("\n", candidates.Select(c => $"- ID: {c.Id}, Name: {c.Name}, Description: {c.Description}"));

        var prompt = $"Main Product:\n- Name: {mainProduct.Name}\n- Description: {mainProduct.Description}\n\n" +
                     $"Candidate Products List:\n{candidateData}\n\n" +
                     $"Identify the top {limit} products from the candidate list that are most similar or highly related to the main product.\n" +
                     $"Return ONLY a raw JSON string array containing the IDs of these top products (e.g. [\"guid-1\", \"guid-2\"]). Do not include markdown code block formatting (such as ```json) or any conversational text.";

        try
        {
            var completion = await _aiService.GenerateCompletionAsync(prompt);
            var similarIds = ExtractGuidList(completion);

            if (similarIds.Any())
            {
                var query = _context.Products
                    .AsNoTracking()
                    .Include(p => p.Images)
                    .Where(p => similarIds.Contains(p.Id));

                var results = await ProjectProductsAsync(query);
                return results.OrderBy(r => similarIds.IndexOf(r.Id)).ToList();
            }
        }
        catch
        {
            // Fallback to basic DB selection if LLM fails
        }

        var fallbackQuery = _context.Products
            .AsNoTracking()
            .Include(p => p.Images)
            .Where(p => p.Id != productId && p.CategoryId == mainProduct.CategoryId && p.IsAvailable)
            .Take(limit);

        return await ProjectProductsAsync(fallbackQuery);
    }

    public async Task<List<ProductResponse>> GetFrequentlyBoughtTogetherAsync(Guid productId, int limit = 3)
    {
        // 1. Look up past orders containing this product to determine frequently bought together items
        var boughtTogetherIds = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.ProductId == productId && oi.Order.Status != OrderStatus.Cancelled)
            .SelectMany(oi => oi.Order.OrderItems)
            .Where(oi => oi.ProductId != productId)
            .GroupBy(oi => oi.ProductId)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .Take(limit)
            .ToListAsync();

        if (boughtTogetherIds.Count >= limit)
        {
            var query = _context.Products
                .AsNoTracking()
                .Include(p => p.Images)
                .Where(p => boughtTogetherIds.Contains(p.Id));

            return await ProjectProductsAsync(query);
        }

        // 2. Fall back to AI recommendation if order history is insufficient
        var mainProduct = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (mainProduct == null)
        {
            throw new KeyNotFoundException($"Product with ID {productId} was not found.");
        }

        var candidates = await _context.Products
            .AsNoTracking()
            .Where(p => p.Id != productId && p.IsAvailable)
            .Take(15)
            .ToListAsync();

        if (candidates.Any())
        {
            var candidateData = string.Join("\n", candidates.Select(c => $"- ID: {c.Id}, Name: {c.Name}, Description: {c.Description}"));
            var prompt = $"Main Product:\n- Name: {mainProduct.Name}\n- Description: {mainProduct.Description}\n\n" +
                         $"Candidate Products List:\n{candidateData}\n\n" +
                         $"Identify the top {limit} products from the candidate list that are most frequently bought together with or complement the main product.\n" +
                         $"Return ONLY a raw JSON string array containing the IDs of these top products (e.g. [\"guid-1\", \"guid-2\"]). Do not include markdown code block formatting or any conversational text.";

            try
            {
                var completion = await _aiService.GenerateCompletionAsync(prompt);
                var aiSuggestedIds = ExtractGuidList(completion);

                // Merge database historical IDs and AI recommendations
                var combinedIds = boughtTogetherIds.Union(aiSuggestedIds).Take(limit).ToList();
                if (combinedIds.Any())
                {
                    var query = _context.Products
                        .AsNoTracking()
                        .Include(p => p.Images)
                        .Where(p => combinedIds.Contains(p.Id));

                    return await ProjectProductsAsync(query);
                }
            }
            catch
            {
                // Fallback
            }
        }

        var fallbackQuery = _context.Products
            .AsNoTracking()
            .Include(p => p.Images)
            .Where(p => p.Id != productId && p.IsAvailable)
            .Take(limit);

        return await ProjectProductsAsync(fallbackQuery);
    }

    public async Task<List<ProductResponse>> GetTrendingProductsAsync(int limit = 5)
    {
        // Calculate trending products as items with the highest sales volume in the last 30 days
        var monthAgo = DateTime.UtcNow.AddDays(-30);
        
        var trendingIds = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.CreatedAt >= monthAgo && oi.Order.Status != OrderStatus.Cancelled)
            .GroupBy(oi => oi.ProductId)
            .OrderByDescending(g => g.Sum(oi => oi.Quantity))
            .Select(g => g.Key)
            .Take(limit)
            .ToListAsync();

        if (trendingIds.Any())
        {
            var query = _context.Products
                .AsNoTracking()
                .Include(p => p.Images)
                .Where(p => trendingIds.Contains(p.Id));

            return await ProjectProductsAsync(query);
        }

        // Default fallback to newest available products
        var newestQuery = _context.Products
            .AsNoTracking()
            .Include(p => p.Images)
            .Where(p => p.IsAvailable)
            .OrderByDescending(p => p.CreatedAt)
            .Take(limit);

        return await ProjectProductsAsync(newestQuery);
    }

    public async Task<List<ProductResponse>> GetPopularNearbyProductsAsync(double latitude, double longitude, double radius, int limit = 5)
    {
        var vendors = await _context.Vendors
            .AsNoTracking()
            .Where(v => v.IsVerified)
            .ToListAsync();

        var nearbyVendorIds = vendors
            .Select(v => new { v.Id, Distance = CalculateHaversineDistance(latitude, longitude, v.Latitude, v.Longitude) })
            .Where(nv => nv.Distance <= radius)
            .Select(nv => nv.Id)
            .ToList();

        if (!nearbyVendorIds.Any())
        {
            return new List<ProductResponse>();
        }

        // Retrieve nearby products ordered by past orders count (popularity)
        var productSales = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Product.IsAvailable && nearbyVendorIds.Contains(oi.Product.VendorId) && oi.Order.Status != OrderStatus.Cancelled)
            .GroupBy(oi => oi.ProductId)
            .Select(g => new
            {
                ProductId = g.Key,
                SalesCount = g.Sum(oi => oi.Quantity)
            })
            .OrderByDescending(x => x.SalesCount)
            .Take(limit)
            .ToListAsync();

        var productIds = productSales.Select(ps => ps.ProductId).ToList();

        var nearbyProducts = await _context.Products
            .AsNoTracking()
            .Include(p => p.Images)
            .Where(p => p.IsAvailable && nearbyVendorIds.Contains(p.VendorId))
            .ToListAsync();

        var orderedNearbyProducts = nearbyProducts
            .Select(p => new
            {
                Product = p,
                SalesCount = productIds.Contains(p.Id) ? productSales.First(ps => ps.ProductId == p.Id).SalesCount : 0
            })
            .OrderByDescending(x => x.SalesCount)
            .ThenByDescending(x => x.Product.CreatedAt)
            .Select(x => x.Product)
            .Take(limit)
            .ToList();

        return orderedNearbyProducts.Select(p => new ProductResponse
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
        }).ToList();
    }

    public async Task<List<ProductResponse>> GetPersonalizedRecommendationsAsync(Guid userId, int limit = 5)
    {
        // 1. Fetch user purchase history to identify preferred product categories
        var preferredCategoryIds = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Order.UserId == userId && oi.Order.Status != OrderStatus.Cancelled)
            .Select(oi => oi.Product.CategoryId)
            .Distinct()
            .ToListAsync();

        if (preferredCategoryIds.Any())
        {
            var productSales = await _context.OrderItems
                .AsNoTracking()
                .Where(oi => oi.Product.IsAvailable && preferredCategoryIds.Contains(oi.Product.CategoryId) && oi.Order.Status != OrderStatus.Cancelled)
                .GroupBy(oi => oi.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    SalesCount = g.Sum(oi => oi.Quantity)
                })
                .OrderByDescending(x => x.SalesCount)
                .Take(limit)
                .ToListAsync();

            var productIds = productSales.Select(ps => ps.ProductId).ToList();

            var products = await _context.Products
                .AsNoTracking()
                .Include(p => p.Images)
                .Where(p => p.IsAvailable && preferredCategoryIds.Contains(p.CategoryId))
                .ToListAsync();

            var orderedPersonalizedProducts = products
                .Select(p => new
                {
                    Product = p,
                    SalesCount = productIds.Contains(p.Id) ? productSales.First(ps => ps.ProductId == p.Id).SalesCount : 0
                })
                .OrderByDescending(x => x.SalesCount)
                .ThenByDescending(x => x.Product.CreatedAt)
                .Select(x => x.Product)
                .Take(limit)
                .ToList();

            return orderedPersonalizedProducts.Select(p => new ProductResponse
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
            }).ToList();
        }

        // Fallback to trending products
        return await GetTrendingProductsAsync(limit);
    }

    public async Task<string> GenerateSmartDescriptionAsync(string productName, string categoryName, string notes)
    {
        var prompt = $"Product Name: {productName}\nCategory: {categoryName}\n" +
                     (string.IsNullOrEmpty(notes) ? "" : $"Key Features/Notes: {notes}\n") +
                     "\nGenerate a professional, marketing-grade, and SEO-friendly description for the product above.\n" +
                     "Keep it engaging, highlight key features, and limit the response to 3 paragraphs max. Return only the description text.";

        return await _aiService.GenerateCompletionAsync(prompt);
    }

    public async Task<List<string>> GenerateSearchSuggestionsAsync(string query, int limit = 5)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new List<string>();
        }

        var catalogSample = await _context.Products
            .AsNoTracking()
            .Where(p => p.IsAvailable)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => p.Name)
            .Take(40)
            .ToListAsync();

        var catalogData = string.Join(", ", catalogSample.Distinct());

        var prompt = $"Catalog Sample names: {catalogData}\n" +
                     $"Partial search query: '{query}'\n\n" +
                     $"Based on the catalog sample names, generate {limit} autocomplete search term suggestions that start with or match '{query}'.\n" +
                     $"Return ONLY a raw JSON string array containing the suggestions (e.g. [\"suggest-1\", \"suggest-2\"]). Do not include markdown code block formatting or conversational text.";

        try
        {
            var completion = await _aiService.GenerateCompletionAsync(prompt);
            var suggestions = JsonSerializer.Deserialize<List<string>>(CleanJsonMarkdown(completion));
            return suggestions?.Take(limit).ToList() ?? new List<string>();
        }
        catch
        {
            // Fallback to database matching
            return await _context.Products
                .AsNoTracking()
                .Where(p => p.IsAvailable && p.Name.ToLower().Contains(query.ToLower()))
                .Select(p => p.Name)
                .Distinct()
                .Take(limit)
                .ToListAsync();
        }
    }

    private List<Guid> ExtractGuidList(string text)
    {
        var list = new List<Guid>();
        try
        {
            text = CleanJsonMarkdown(text);
            var ids = JsonSerializer.Deserialize<List<string>>(text);
            if (ids != null)
            {
                foreach (var id in ids)
                {
                    if (Guid.TryParse(id, out var guid))
                    {
                        list.Add(guid);
                    }
                }
            }
        }
        catch
        {
            // Empty list
        }
        return list;
    }

    private string CleanJsonMarkdown(string text)
    {
        text = text.Trim();
        if (text.Contains("```json"))
        {
            var start = text.IndexOf("```json") + 7;
            var end = text.LastIndexOf("```");
            text = text.Substring(start, end - start).Trim();
        }
        else if (text.Contains("```"))
        {
            var start = text.IndexOf("```") + 3;
            var end = text.LastIndexOf("```");
            text = text.Substring(start, end - start).Trim();
        }
        return text;
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
        return 6371 * c; // Earth's radius in KM
    }

    private double ToRadians(double angle)
    {
        return Math.PI * angle / 180.0;
    }
}
