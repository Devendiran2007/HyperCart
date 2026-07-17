using HyperLocal.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HyperLocal.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class SearchController : ControllerBase
{
    private readonly IHyperlocalSearchService _searchService;

    public SearchController(IHyperlocalSearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet("nearby")]
    public async Task<IActionResult> SearchNearby(
        [FromQuery] double latitude,
        [FromQuery] double longitude,
        [FromQuery] double? radius = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] string? search = null,
        [FromQuery] string? sort = null)
    {
        // Coordinate bounds validation
        if (latitude < -90.0 || latitude > 90.0)
        {
            return BadRequest(new { message = "Latitude must be between -90 and 90." });
        }

        if (longitude < -180.0 || longitude > 180.0)
        {
            return BadRequest(new { message = "Longitude must be between -180 and 180." });
        }

        if (radius.HasValue && radius.Value <= 0.0)
        {
            return BadRequest(new { message = "Search radius must be greater than 0." });
        }

        var result = await _searchService.SearchNearbyAsync(latitude, longitude, radius, categoryId, search, sort);
        return Ok(result);
    }
}
