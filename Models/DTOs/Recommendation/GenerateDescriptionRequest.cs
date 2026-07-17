using System.ComponentModel.DataAnnotations;

namespace HyperLocal.Models.DTOs.Recommendation;

public class GenerateDescriptionRequest
{
    [Required(ErrorMessage = "ProductName is required.")]
    public string ProductName { get; set; } = string.Empty;

    [Required(ErrorMessage = "CategoryName is required.")]
    public string CategoryName { get; set; } = string.Empty;

    public string? Notes { get; set; }
}
