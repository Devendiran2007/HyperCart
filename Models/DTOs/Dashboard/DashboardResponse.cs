using System.Collections.Generic;

namespace HyperLocal.Models.DTOs.Dashboard;

public class DashboardResponse
{
    public decimal TotalRevenue { get; set; }

    public decimal TodayRevenue { get; set; }

    public decimal WeeklyRevenue { get; set; }

    public decimal MonthlyRevenue { get; set; }

    public int TotalOrders { get; set; }

    public int TodayOrders { get; set; }

    public int CompletedOrders { get; set; }

    public int CancelledOrders { get; set; }

    public int PendingOrders { get; set; }

    public decimal AverageOrderValue { get; set; }

    public int TotalProducts { get; set; }

    public int ActiveProducts { get; set; }

    public int OutOfStockProducts { get; set; }

    public int LowStockProducts { get; set; }

    public int NewCustomersCount { get; set; }

    public int ReturningCustomersCount { get; set; }

    public List<TopCustomerResponse> TopCustomers { get; set; } = new();
}
