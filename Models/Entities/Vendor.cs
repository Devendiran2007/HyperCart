using System.ComponentModel.DataAnnotations;

namespace HyperLocal.Models.Entities;

public class Vendor
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    [MaxLength(100)]
    public string StoreName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public string? LogoUrl { get; set; }

    public string? Address { get; set; }

    public bool IsVerified { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User User { get; set; } = null!;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}