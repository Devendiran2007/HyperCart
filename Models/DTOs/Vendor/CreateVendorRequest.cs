using System.ComponentModel.DataAnnotations;

namespace HyperLocal.Models.DTOs.Vendor;

public class CreateVendorRequest
{
    [Required]
    [MaxLength(100)]
    public string StoreName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public string? LogoUrl { get; set; }

    public string? Address { get; set; }

    [Required(ErrorMessage = "Latitude is required.")]
    [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90.")]
    public double? Latitude { get; set; }

    [Required(ErrorMessage = "Longitude is required.")]
    [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180.")]
    public double? Longitude { get; set; }

    public int DeliveryRadiusKm { get; set; } = 5;
}
