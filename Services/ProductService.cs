using HyperLocal.Data;
using HyperLocal.Helpers;
using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Product;
using HyperLocal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HyperLocal.Services;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;
    private readonly IImageUploadService _imageUploadService;

    public ProductService(ApplicationDbContext context, IImageUploadService imageUploadService)
    {
        _context = context;
        _imageUploadService = imageUploadService;
    }

    public async Task<ProductResponse> CreateProductAsync(Guid userId, CreateProductRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == userId);
        if (vendor == null)
        {
            throw new UnauthorizedAccessException("Logged-in user is not associated with any vendor profile.");
        }

        if (!vendor.IsVerified)
        {
            throw new InvalidOperationException("Only verified vendors are allowed to create products.");
        }

        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists)
        {
            throw new CategoryNotFoundException($"Category with ID {request.CategoryId} does not exist.");
        }

        var newImageCount = request.Images?.Count ?? 0;
        if (newImageCount > 10)
        {
            throw new ArgumentException("A product can have a maximum of 10 images.");
        }

        var product = new Product
        {
            Id = Guid.NewGuid(),
            VendorId = vendor.Id,
            CategoryId = request.CategoryId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            IsAvailable = request.Stock > 0,
            CreatedAt = DateTime.UtcNow
        };

        if (request.Images != null && request.Images.Count > 0)
        {
            int order = 0;
            foreach (var file in request.Images)
            {
                var folderPath = $"products/{vendor.Id}";
                var imageUrl = await _imageUploadService.UploadImageAsync(file, folderPath);
                
                product.Images.Add(new ProductImage
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    ImageUrl = imageUrl,
                    DisplayOrder = order++
                });
            }
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return new ProductResponse
        {
            Id = product.Id,
            VendorId = product.VendorId,
            CategoryId = product.CategoryId,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            IsAvailable = product.IsAvailable,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            ImageUrls = product.Images.OrderBy(i => i.DisplayOrder).Select(i => i.ImageUrl).ToList()
        };
    }

    public async Task<ProductResponse> UpdateProductAsync(Guid userId, Guid productId, UpdateProductRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == userId);
        if (vendor == null)
        {
            throw new UnauthorizedAccessException("Logged-in user is not associated with any vendor profile.");
        }

        var product = await _context.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null)
        {
            throw new KeyNotFoundException($"Product with ID {productId} was not found.");
        }

        if (product.VendorId != vendor.Id)
        {
            throw new UnauthorizedAccessException("Vendors can only edit their own products.");
        }

        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists)
        {
            throw new CategoryNotFoundException($"Category with ID {request.CategoryId} does not exist.");
        }

        var existingCount = request.ExistingImageUrls?.Count ?? 0;
        var newCount = request.NewImages?.Count ?? 0;
        if (existingCount + newCount > 10)
        {
            throw new ArgumentException("A product can have a maximum of 10 images.");
        }

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.IsAvailable = request.Stock > 0;
        product.CategoryId = request.CategoryId;
        product.UpdatedAt = DateTime.UtcNow;

        // Remove images not kept
        var keepUrls = request.ExistingImageUrls ?? new List<string>();
        var toRemove = product.Images.Where(img => !keepUrls.Contains(img.ImageUrl)).ToList();
        foreach (var img in toRemove)
        {
            _context.ProductImages.Remove(img);
        }

        // Upload and append new images
        int order = keepUrls.Count;
        if (request.NewImages != null && request.NewImages.Count > 0)
        {
            foreach (var file in request.NewImages)
            {
                var folderPath = $"products/{vendor.Id}";
                var imageUrl = await _imageUploadService.UploadImageAsync(file, folderPath);
                
                product.Images.Add(new ProductImage
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    ImageUrl = imageUrl,
                    DisplayOrder = order++
                });
            }
        }

        // Fix DisplayOrder sequences
        int seq = 0;
        foreach (var img in product.Images.OrderBy(i => i.DisplayOrder))
        {
            img.DisplayOrder = seq++;
        }

        await _context.SaveChangesAsync();

        return new ProductResponse
        {
            Id = product.Id,
            VendorId = product.VendorId,
            CategoryId = product.CategoryId,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            IsAvailable = product.IsAvailable,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            ImageUrls = product.Images.OrderBy(i => i.DisplayOrder).Select(i => i.ImageUrl).ToList()
        };
    }

    public async Task<bool> DeleteProductAsync(Guid userId, Guid productId)
    {
        var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == userId);
        if (vendor == null)
        {
            throw new UnauthorizedAccessException("Logged-in user is not associated with any vendor profile.");
        }

        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
        if (product == null)
        {
            throw new KeyNotFoundException($"Product with ID {productId} was not found.");
        }

        if (product.VendorId != vendor.Id)
        {
            throw new UnauthorizedAccessException("Vendors can only delete their own products.");
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<ProductResponse?> GetProductByIdAsync(Guid id)
    {
        return await _context.Products
            .AsNoTracking()
            .Where(p => p.Id == id)
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
            .FirstOrDefaultAsync();
    }

    public async Task<List<ProductResponse>> GetVendorProductsAsync(Guid vendorId)
    {
        return await _context.Products
            .AsNoTracking()
            .Where(p => p.VendorId == vendorId)
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

    public async Task<ProductListResponse> GetAllProductsAsync(ProductFilterParams filter)
    {
        if (filter == null)
        {
            filter = new ProductFilterParams();
        }

        var query = _context.Products.AsNoTracking().AsQueryable();

        // Apply filters
        if (filter.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == filter.CategoryId.Value);
        }

        if (filter.VendorId.HasValue)
        {
            query = query.Where(p => p.VendorId == filter.VendorId.Value);
        }

        if (filter.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= filter.MinPrice.Value);
        }

        if (filter.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= filter.MaxPrice.Value);
        }

        if (filter.InStock.HasValue)
        {
            query = filter.InStock.Value 
                ? query.Where(p => p.Stock > 0) 
                : query.Where(p => p.Stock == 0);
        }

        // Apply sorting
        if (string.Equals(filter.SortBy, "newest", StringComparison.OrdinalIgnoreCase))
        {
            query = query.OrderByDescending(p => p.CreatedAt);
        }
        else if (string.Equals(filter.SortBy, "lowest_price", StringComparison.OrdinalIgnoreCase))
        {
            query = query.OrderBy(p => p.Price);
        }
        else if (string.Equals(filter.SortBy, "highest_price", StringComparison.OrdinalIgnoreCase))
        {
            query = query.OrderByDescending(p => p.Price);
        }
        else
        {
            query = query.OrderByDescending(p => p.CreatedAt);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
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

        return new ProductListResponse
        {
            TotalCount = totalCount,
            CurrentPage = filter.Page,
            PageSize = filter.PageSize,
            Items = items
        };
    }

    public async Task<ProductListResponse> SearchProductsAsync(string query, int page, int pageSize)
    {
        var searchQuery = _context.Products.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var searchLower = query.ToLower();
            searchQuery = searchQuery.Where(p => p.Name.ToLower().Contains(searchLower) || p.Description.ToLower().Contains(searchLower));
        }

        var totalCount = await searchQuery.CountAsync();
        var items = await searchQuery
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
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

        return new ProductListResponse
        {
            TotalCount = totalCount,
            CurrentPage = page,
            PageSize = pageSize,
            Items = items
        };
    }
}
