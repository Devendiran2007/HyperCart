using System.Collections.Generic;

namespace HyperLocal.Models.DTOs.Cart;

public class CheckoutValidationResult
{
    public bool IsValid { get; set; }

    public List<string> Errors { get; set; } = new();
}
