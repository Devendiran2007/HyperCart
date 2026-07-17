using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HyperLocal.Models.DTOs.Product;

public class CreateProductRequest
{
    [Required(ErrorMessage = "Product name is required.")]
    [MaxLength(150, ErrorMessage = "Product name cannot exceed 150 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Product description is required.")]
    [MaxLength(1000, ErrorMessage = "Product description cannot exceed 1000 characters.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Price is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Stock is required.")]
    [Range(0, int.MaxValue, ErrorMessage = "Stock must be 0 or greater.")]
    public int Stock { get; set; }

    [Required(ErrorMessage = "CategoryId is required.")]
    public Guid CategoryId { get; set; }

    public List<IFormFile>? Images { get; set; }
}
