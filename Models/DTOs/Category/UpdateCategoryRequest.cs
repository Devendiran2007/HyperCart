using System.ComponentModel.DataAnnotations;

namespace HyperLocal.Models.DTOs.Category;

public class UpdateCategoryRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }
}