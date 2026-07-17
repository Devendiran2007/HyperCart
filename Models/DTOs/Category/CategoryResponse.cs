namespace HyperLocal.Models.DTOs.Category;

public class CategoryResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }
}