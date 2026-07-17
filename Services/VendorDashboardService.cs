using HyperLocal.Data;
using HyperLocal.Helpers;
using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Dashboard;
using HyperLocal.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HyperLocal.Services;

public class VendorDashboardService : IVendorDashboardService
{
    private readonly ApplicationDbContext _context;

    public VendorDashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    private async Task<Guid> GetVendorIdAsync(Guid userId)
    {
        var vendor = await _context.Vendors
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.UserId == userId);

        if (vendor == null)
        {
            throw new UnauthorizedAccessException("Logged-in user is not associated with any vendor profile.");
        }

        return vendor.Id;
    }

    public async Task<DashboardResponse> GetDashboardAsync(Guid userId)
    {
        var vendorId = await GetVendorIdAsync(userId);

        var today = DateTime.UtcNow.Date;
        var weekAgo = DateTime.UtcNow.Date.AddDays(-7);
        var monthAgo = DateTime.UtcNow.Date.AddDays(-30);

        // 1. Revenue calculations (excluding Cancelled orders)
        var totalRevenue = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Product.VendorId == vendorId && oi.Order.Status != OrderStatus.Cancelled)
            .SumAsync(oi => (decimal?)oi.Quantity * oi.Price) ?? 0M;

        var todayRevenue = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Product.VendorId == vendorId && oi.Order.Status != OrderStatus.Cancelled && oi.Order.CreatedAt >= today)
            .SumAsync(oi => (decimal?)oi.Quantity * oi.Price) ?? 0M;

        var weeklyRevenue = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Product.VendorId == vendorId && oi.Order.Status != OrderStatus.Cancelled && oi.Order.CreatedAt >= weekAgo)
            .SumAsync(oi => (decimal?)oi.Quantity * oi.Price) ?? 0M;

        var monthlyRevenue = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Product.VendorId == vendorId && oi.Order.Status != OrderStatus.Cancelled && oi.Order.CreatedAt >= monthAgo)
            .SumAsync(oi => (decimal?)oi.Quantity * oi.Price) ?? 0M;

        // 2. Order statistics
        var totalOrders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.OrderItems.Any(oi => oi.Product.VendorId == vendorId))
            .CountAsync();

        var todayOrders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.CreatedAt >= today && o.OrderItems.Any(oi => oi.Product.VendorId == vendorId))
            .CountAsync();

        var completedOrders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Status == OrderStatus.Delivered && o.OrderItems.Any(oi => oi.Product.VendorId == vendorId))
            .CountAsync();

        var cancelledOrders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Status == OrderStatus.Cancelled && o.OrderItems.Any(oi => oi.Product.VendorId == vendorId))
            .CountAsync();

        var pendingOrders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Status == OrderStatus.Pending && o.OrderItems.Any(oi => oi.Product.VendorId == vendorId))
            .CountAsync();

        var nonCancelledOrdersCount = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Status != OrderStatus.Cancelled && o.OrderItems.Any(oi => oi.Product.VendorId == vendorId))
            .CountAsync();

        var averageOrderValue = nonCancelledOrdersCount > 0 ? Math.Round(totalRevenue / nonCancelledOrdersCount, 2) : 0M;

        // 3. Product statistics
        var totalProducts = await _context.Products
            .AsNoTracking()
            .Where(p => p.VendorId == vendorId)
            .CountAsync();

        var activeProducts = await _context.Products
            .AsNoTracking()
            .Where(p => p.VendorId == vendorId && p.IsAvailable)
            .CountAsync();

        var outOfStockProducts = await _context.Products
            .AsNoTracking()
            .Where(p => p.VendorId == vendorId && p.Stock == 0)
            .CountAsync();

        var lowStockProducts = await _context.Products
            .AsNoTracking()
            .Where(p => p.VendorId == vendorId && p.Stock < 10)
            .CountAsync();

        // 4. Customer cohort analytics
        var customerOrdersSummary = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Status != OrderStatus.Cancelled && o.OrderItems.Any(oi => oi.Product.VendorId == vendorId))
            .GroupBy(o => o.UserId)
            .Select(g => new
            {
                UserId = g.Key,
                OrderCount = g.Count(),
                TotalSpend = g.SelectMany(o => o.OrderItems)
                              .Where(oi => oi.Product.VendorId == vendorId)
                              .Sum(oi => oi.Quantity * oi.Price)
            })
            .ToListAsync();

        var newCustomersCount = customerOrdersSummary.Count(c => c.OrderCount == 1);
        var returningCustomersCount = customerOrdersSummary.Count(c => c.OrderCount > 1);

        var topCustomersIds = customerOrdersSummary
            .OrderByDescending(c => c.TotalSpend)
            .Take(5)
            .Select(c => c.UserId)
            .ToList();

        var topCustomerProfiles = await _context.Users
            .AsNoTracking()
            .Where(u => topCustomersIds.Contains(u.Id))
            .Select(u => new { u.Id, u.FullName, u.Email })
            .ToDictionaryAsync(u => u.Id);

        var topCustomers = customerOrdersSummary
            .OrderByDescending(c => c.TotalSpend)
            .Take(5)
            .Select(c => new TopCustomerResponse
            {
                CustomerId = c.UserId,
                CustomerName = topCustomerProfiles.ContainsKey(c.UserId) ? topCustomerProfiles[c.UserId].FullName : "Unknown",
                CustomerEmail = topCustomerProfiles.ContainsKey(c.UserId) ? topCustomerProfiles[c.UserId].Email : "Unknown",
                OrderCount = c.OrderCount,
                TotalSpend = Math.Round(c.TotalSpend, 2)
            })
            .ToList();

        return new DashboardResponse
        {
            TotalRevenue = Math.Round(totalRevenue, 2),
            TodayRevenue = Math.Round(todayRevenue, 2),
            WeeklyRevenue = Math.Round(weeklyRevenue, 2),
            MonthlyRevenue = Math.Round(monthlyRevenue, 2),
            TotalOrders = totalOrders,
            TodayOrders = todayOrders,
            CompletedOrders = completedOrders,
            CancelledOrders = cancelledOrders,
            PendingOrders = pendingOrders,
            AverageOrderValue = averageOrderValue,
            TotalProducts = totalProducts,
            ActiveProducts = activeProducts,
            OutOfStockProducts = outOfStockProducts,
            LowStockProducts = lowStockProducts,
            NewCustomersCount = newCustomersCount,
            ReturningCustomersCount = returningCustomersCount,
            TopCustomers = topCustomers
        };
    }

    public async Task<RevenueChartResponse> GetRevenueChartAsync(Guid userId)
    {
        var vendorId = await GetVendorIdAsync(userId);

        var startOfYear = new DateTime(DateTime.UtcNow.Year, 1, 1);
        var thirtyDaysAgo = DateTime.UtcNow.Date.AddDays(-30);

        // 1. Monthly Revenue
        var monthlyRevenueList = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Product.VendorId == vendorId && oi.Order.Status != OrderStatus.Cancelled && oi.Order.CreatedAt >= startOfYear)
            .GroupBy(oi => new { Year = oi.Order.CreatedAt.Year, Month = oi.Order.CreatedAt.Month })
            .Select(g => new ChartPoint
            {
                Label = $"{g.Key.Year}-{g.Key.Month:D2}",
                Value = Math.Round(g.Sum(oi => oi.Quantity * oi.Price), 2)
            })
            .OrderBy(p => p.Label)
            .ToListAsync();

        // 2. Daily Revenue
        var dailyRevenueList = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Product.VendorId == vendorId && oi.Order.Status != OrderStatus.Cancelled && oi.Order.CreatedAt >= thirtyDaysAgo)
            .GroupBy(oi => oi.Order.CreatedAt.Date)
            .Select(g => new ChartPoint
            {
                Label = g.Key.ToString("yyyy-MM-dd"),
                Value = Math.Round(g.Sum(oi => oi.Quantity * oi.Price), 2)
            })
            .OrderBy(p => p.Label)
            .ToListAsync();

        // 3. Revenue by Category
        var categoryRevenueList = await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Product.VendorId == vendorId && oi.Order.Status != OrderStatus.Cancelled)
            .GroupBy(oi => oi.Product.Category.Name)
            .Select(g => new ChartPoint
            {
                Label = g.Key,
                Value = Math.Round(g.Sum(oi => oi.Quantity * oi.Price), 2)
            })
            .OrderByDescending(p => p.Value)
            .ToListAsync();

        return new RevenueChartResponse
        {
            MonthlyRevenue = monthlyRevenueList,
            DailyRevenue = dailyRevenueList,
            CategoryRevenue = categoryRevenueList
        };
    }

    public async Task<List<BestSellingProductResponse>> GetTopProductsAsync(Guid userId, int limit = 5)
    {
        var vendorId = await GetVendorIdAsync(userId);

        return await _context.OrderItems
            .AsNoTracking()
            .Where(oi => oi.Product.VendorId == vendorId && oi.Order.Status != OrderStatus.Cancelled)
            .GroupBy(oi => new { oi.ProductId, oi.Product.Name, oi.Product.Stock })
            .Select(g => new BestSellingProductResponse
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.Name,
                QuantitySold = g.Sum(oi => oi.Quantity),
                Revenue = Math.Round(g.Sum(oi => oi.Quantity * oi.Price), 2),
                CurrentStock = g.Key.Stock
            })
            .OrderByDescending(p => p.QuantitySold)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<RecentOrderResponse>> GetRecentOrdersAsync(Guid userId, int limit = 5)
    {
        var vendorId = await GetVendorIdAsync(userId);

        return await _context.Orders
            .AsNoTracking()
            .Where(o => o.OrderItems.Any(oi => oi.Product.VendorId == vendorId))
            .OrderByDescending(o => o.CreatedAt)
            .Take(limit)
            .Select(o => new RecentOrderResponse
            {
                OrderId = o.Id,
                OrderNumber = o.OrderNumber,
                CustomerName = o.User.FullName,
                ItemCount = o.OrderItems.Where(oi => oi.Product.VendorId == vendorId).Sum(oi => oi.Quantity),
                TotalAmount = Math.Round(o.OrderItems.Where(oi => oi.Product.VendorId == vendorId).Sum(oi => oi.Quantity * oi.Price), 2),
                Status = o.Status,
                CreatedAt = o.CreatedAt
            })
            .ToListAsync();
    }
}
