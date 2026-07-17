using HyperLocal.Models.DTOs.Dashboard;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HyperLocal.Interfaces;

public interface IVendorDashboardService
{
    Task<DashboardResponse> GetDashboardAsync(Guid userId);

    Task<RevenueChartResponse> GetRevenueChartAsync(Guid userId);

    Task<List<BestSellingProductResponse>> GetTopProductsAsync(Guid userId, int limit = 5);

    Task<List<RecentOrderResponse>> GetRecentOrdersAsync(Guid userId, int limit = 5);
}
