using HyperLocal.Models.DTOs.Cart;
using System;
using System.Threading.Tasks;

namespace HyperLocal.Interfaces;

public interface ICartService
{
    Task<CartResponse> GetCartAsync(Guid userId);

    Task<CartResponse> AddToCartAsync(Guid userId, AddToCartRequest request);

    Task<CartResponse> UpdateQuantityAsync(Guid userId, Guid cartItemId, UpdateCartItemRequest request);

    Task<CartResponse> RemoveItemAsync(Guid userId, Guid cartItemId);

    Task<CartResponse> ClearCartAsync(Guid userId);

    Task<CheckoutValidationResult> ValidateCartForCheckoutAsync(Guid userId);
}
