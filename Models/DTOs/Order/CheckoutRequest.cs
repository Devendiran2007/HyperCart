using System.ComponentModel.DataAnnotations;

namespace HyperLocal.Models.DTOs.Order;

public class CheckoutRequest
{
    [Required(ErrorMessage = "ShippingAddress is required.")]
    public string ShippingAddress { get; set; } = string.Empty;

    [Required(ErrorMessage = "PaymentMethod is required.")]
    public string PaymentMethod { get; set; } = string.Empty;
}
