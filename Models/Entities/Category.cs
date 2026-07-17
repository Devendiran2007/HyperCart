using System.ComponentModel.DataAnnotations;

namespace HyperLocal.Models.Entities;

public class Category
{
    public Guid Id { get; set; }

    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
}