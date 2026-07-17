using HyperLocal.Models.DTOs.Product;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HyperLocal.Interfaces;

public interface IProductService
{
    Task<ProductResponse> CreateProductAsync(Guid userId, CreateProductRequest request);

    Task<ProductResponse> UpdateProductAsync(Guid userId, Guid productId, UpdateProductRequest request);

    Task<bool> DeleteProductAsync(Guid userId, Guid productId);

    Task<ProductResponse?> GetProductByIdAsync(Guid id);

    Task<List<ProductResponse>> GetVendorProductsAsync(Guid vendorId);

    Task<ProductListResponse> GetAllProductsAsync(ProductFilterParams filter);

    Task<ProductListResponse> SearchProductsAsync(string query, int page, int pageSize);
}
