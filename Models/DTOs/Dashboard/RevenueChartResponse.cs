using System.Collections.Generic;

namespace HyperLocal.Models.DTOs.Dashboard;

public class RevenueChartResponse
{
    public List<ChartPoint> MonthlyRevenue { get; set; } = new();

    public List<ChartPoint> DailyRevenue { get; set; } = new();

    public List<ChartPoint> CategoryRevenue { get; set; } = new();
}
