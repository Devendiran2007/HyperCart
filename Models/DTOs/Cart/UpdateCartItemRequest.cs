using System.ComponentModel.DataAnnotations;

namespace HyperLocal.Models.DTOs.Cart;

public class UpdateCartItemRequest
{
    [Required(ErrorMessage = "Quantity is required.")]
    [Range(0, int.MaxValue, ErrorMessage = "Quantity cannot be negative.")]
    public int Quantity { get; set; }
}
