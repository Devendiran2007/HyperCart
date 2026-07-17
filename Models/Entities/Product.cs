using System.ComponentModel.DataAnnotations;

namespace HyperLocal.Models.Entities;

public class Product
{
    public Guid Id { get; set; }

    public Guid VendorId { get; set; }

    public Guid CategoryId { get; set; }

    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Stock { get; set; }

    public bool IsAvailable { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public Vendor Vendor { get; set; } = null!;

    public Category Category { get; set; } = null!;

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();

    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
