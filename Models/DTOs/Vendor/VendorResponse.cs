using System;

namespace HyperLocal.Models.DTOs.Vendor;

public class VendorResponse
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string StoreName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? LogoUrl { get; set; }

    public string? Address { get; set; }

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public int DeliveryRadiusKm { get; set; }

    public bool IsVerified { get; set; }

    public DateTime CreatedAt { get; set; }
}
