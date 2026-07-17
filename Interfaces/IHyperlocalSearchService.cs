using HyperLocal.Models.DTOs.Search;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HyperLocal.Interfaces;

public interface IHyperlocalSearchService
{
    Task<List<NearbyVendorResponse>> SearchNearbyAsync(
        double latitude,
        double longitude,
        double? radius,
        Guid? categoryId,
        string? search,
        string? sort);
}
