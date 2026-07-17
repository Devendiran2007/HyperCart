using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Recommendation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HyperLocal.Controllers;

[ApiController]
[Route("api/recommendations")]
public class RecommendationsController : ControllerBase
{
    private readonly IAiRecommendationService _recommendationService;

    public RecommendationsController(IAiRecommendationService recommendationService)
    {
        _recommendationService = recommendationService;
    }

    [HttpGet("similar/{productId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSimilar(Guid productId, [FromQuery] int limit = 5)
    {
        var result = await _recommendationService.GetSimilarProductsAsync(productId, limit);
        return Ok(result);
    }

    [HttpGet("bought-together/{productId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBoughtTogether(Guid productId, [FromQuery] int limit = 3)
    {
        var result = await _recommendationService.GetFrequentlyBoughtTogetherAsync(productId, limit);
        return Ok(result);
    }

    [HttpGet("trending")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTrending([FromQuery] int limit = 5)
    {
        var result = await _recommendationService.GetTrendingProductsAsync(limit);
        return Ok(result);
    }

    [HttpGet("nearby")]
    [AllowAnonymous]
    public async Task<IActionResult> GetNearby(
        [FromQuery] double latitude,
        [FromQuery] double longitude,
        [FromQuery] double radius,
        [FromQuery] int limit = 5)
    {
        if (latitude < -90.0 || latitude > 90.0 || longitude < -180.0 || longitude > 180.0)
        {
            return BadRequest(new { message = "Invalid coordinates." });
        }

        var result = await _recommendationService.GetPopularNearbyProductsAsync(latitude, longitude, radius, limit);
        return Ok(result);
    }

    [HttpGet("personalized")]
    [Authorize]
    public async Task<IActionResult> GetPersonalized([FromQuery] int limit = 5)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var result = await _recommendationService.GetPersonalizedRecommendationsAsync(userId, limit);
        return Ok(result);
    }

    [HttpPost("description")]
    [Authorize(Roles = "Vendor")]
    public async Task<IActionResult> GenerateDescription([FromBody] GenerateDescriptionRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _recommendationService.GenerateSmartDescriptionAsync(request.ProductName, request.CategoryName, request.Notes ?? string.Empty);
        return Ok(new { description = result });
    }

    [HttpGet("suggestions")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSuggestions([FromQuery] string query, [FromQuery] int limit = 5)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest(new { message = "Search query prefix is required." });
        }

        var result = await _recommendationService.GenerateSearchSuggestionsAsync(query, limit);
        return Ok(result);
    }
}
