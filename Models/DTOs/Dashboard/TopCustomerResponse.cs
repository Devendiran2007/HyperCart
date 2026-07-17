using System;

namespace HyperLocal.Models.DTOs.Dashboard;

public class TopCustomerResponse
{
    public Guid CustomerId { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerEmail { get; set; } = string.Empty;

    public int OrderCount { get; set; }

    public decimal TotalSpend { get; set; }
}
