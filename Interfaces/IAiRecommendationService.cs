using HyperLocal.Models.DTOs.Product;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HyperLocal.Interfaces;

public interface IAiRecommendationService
{
    Task<List<ProductResponse>> GetSimilarProductsAsync(Guid productId, int limit = 5);

    Task<List<ProductResponse>> GetFrequentlyBoughtTogetherAsync(Guid productId, int limit = 3);

    Task<List<ProductResponse>> GetTrendingProductsAsync(int limit = 5);

    Task<List<ProductResponse>> GetPopularNearbyProductsAsync(double latitude, double longitude, double radius, int limit = 5);

    Task<List<ProductResponse>> GetPersonalizedRecommendationsAsync(Guid userId, int limit = 5);

    Task<string> GenerateSmartDescriptionAsync(string productName, string categoryName, string notes);

    Task<List<string>> GenerateSearchSuggestionsAsync(string query, int limit = 5);
}
