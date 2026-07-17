using HyperLocal.Data;
using HyperLocal.Helpers;
using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Cart;
using HyperLocal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HyperLocal.Services;

public class CartService : ICartService
{
    private readonly ApplicationDbContext _context;
    private readonly INotificationService _notificationService;

    public CartService(ApplicationDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    private async Task<Cart> GetOrCreateCartAsync(Guid userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        return cart;
    }

    private async Task<CartResponse> MapCartToResponseAsync(Guid userId)
    {
        // Fetch cart items using LINQ projections for high performance
        var cartItems = await _context.CartItems
            .AsNoTracking()
            .Where(ci => ci.Cart.UserId == userId)
            .Select(ci => new CartItemResponse
            {
                Id = ci.Id,
                ProductId = ci.ProductId,
                ProductName = ci.Product.Name,
                Price = ci.Product.Price,
                Quantity = ci.Quantity,
                ImageUrl = ci.Product.Images.OrderBy(i => i.DisplayOrder).Select(i => i.ImageUrl).FirstOrDefault()
            })
            .ToListAsync();

        var subtotal = cartItems.Sum(item => item.Price * item.Quantity);
        var tax = Math.Round(subtotal * 0.10M, 2); // 10% tax rate
        var grandTotal = subtotal + tax;
        var itemCount = cartItems.Sum(item => item.Quantity);

        var cartId = await _context.Carts
            .Where(c => c.UserId == userId)
            .Select(c => c.Id)
            .FirstOrDefaultAsync();

        return new CartResponse
        {
            Id = cartId,
            UserId = userId,
            Items = cartItems,
            Subtotal = subtotal,
            Tax = tax,
            GrandTotal = grandTotal,
            ItemCount = itemCount
        };
    }

    public async Task<CartResponse> GetCartAsync(Guid userId)
    {
        // Trigger cart creation if it does not exist yet
        await GetOrCreateCartAsync(userId);
        return await MapCartToResponseAsync(userId);
    }

    public async Task<CartResponse> AddToCartAsync(Guid userId, AddToCartRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var product = await _context.Products
            .Include(p => p.Vendor)
            .FirstOrDefaultAsync(p => p.Id == request.ProductId);

        if (product == null)
        {
            throw new KeyNotFoundException($"Product with ID {request.ProductId} was not found.");
        }

        if (!product.IsAvailable)
        {
            throw new InvalidOperationException("Cannot add inactive products to the cart.");
        }

        if (product.Vendor == null || !product.Vendor.IsVerified)
        {
            throw new InvalidOperationException("Cannot add products from unverified vendors.");
        }

        var cart = await GetOrCreateCartAsync(userId);

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == request.ProductId);
        var currentQuantity = cartItem?.Quantity ?? 0;
        var targetQuantity = currentQuantity + request.Quantity;

        if (targetQuantity > product.Stock)
        {
            throw new InvalidOperationException($"Cannot add more than available stock. Available stock: {product.Stock}");
        }

        if (cartItem == null)
        {
            cartItem = new CartItem
            {
                Id = Guid.NewGuid(),
                CartId = cart.Id,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };
            _context.CartItems.Add(cartItem);
        }
        else
        {
            cartItem.Quantity = targetQuantity;
        }

        await _context.SaveChangesAsync();
        await _notificationService.NotifyCartSyncAsync(userId);
        return await MapCartToResponseAsync(userId);
    }

    public async Task<CartResponse> UpdateQuantityAsync(Guid userId, Guid cartItemId, UpdateCartItemRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var cartItem = await _context.CartItems
            .Include(ci => ci.Product)
            .ThenInclude(p => p.Vendor)
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.Cart.UserId == userId);

        if (cartItem == null)
        {
            throw new KeyNotFoundException($"Cart item with ID {cartItemId} was not found in your cart.");
        }

        if (request.Quantity <= 0)
        {
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            await _notificationService.NotifyCartSyncAsync(userId);
            return await MapCartToResponseAsync(userId);
        }

        var product = cartItem.Product;
        if (product == null)
        {
            throw new KeyNotFoundException("Product associated with this cart item no longer exists.");
        }

        if (!product.IsAvailable)
        {
            throw new InvalidOperationException("Cannot update quantity for inactive products.");
        }

        if (product.Vendor == null || !product.Vendor.IsVerified)
        {
            throw new InvalidOperationException("Cannot update quantity for products belonging to unverified vendors.");
        }

        if (request.Quantity > product.Stock)
        {
            throw new InvalidOperationException($"Cannot add more than available stock. Available stock: {product.Stock}");
        }

        cartItem.Quantity = request.Quantity;
        await _context.SaveChangesAsync();
        await _notificationService.NotifyCartSyncAsync(userId);

        return await MapCartToResponseAsync(userId);
    }

    public async Task<CartResponse> RemoveItemAsync(Guid userId, Guid cartItemId)
    {
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.Cart.UserId == userId);

        if (cartItem == null)
        {
            throw new KeyNotFoundException($"Cart item with ID {cartItemId} was not found in your cart.");
        }

        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();
        await _notificationService.NotifyCartSyncAsync(userId);

        return await MapCartToResponseAsync(userId);
    }

    public async Task<CartResponse> ClearCartAsync(Guid userId)
    {
        var cart = await GetOrCreateCartAsync(userId);
        
        var cartItems = await _context.CartItems
            .Where(ci => ci.CartId == cart.Id)
            .ToListAsync();

        _context.CartItems.RemoveRange(cartItems);
        await _context.SaveChangesAsync();
        await _notificationService.NotifyCartSyncAsync(userId);

        return await MapCartToResponseAsync(userId);
    }

    public async Task<CheckoutValidationResult> ValidateCartForCheckoutAsync(Guid userId)
    {
        var result = new CheckoutValidationResult { IsValid = true };
        
        var cartItems = await _context.CartItems
            .Include(ci => ci.Product)
            .ThenInclude(p => p.Vendor)
            .Where(ci => ci.Cart.UserId == userId)
            .ToListAsync();

        foreach (var item in cartItems)
        {
            if (item.Product == null)
            {
                result.IsValid = false;
                result.Errors.Add($"Product with ID {item.ProductId} no longer exists.");
                continue;
            }

            if (!item.Product.IsAvailable)
            {
                result.IsValid = false;
                result.Errors.Add($"Product '{item.Product.Name}' is currently inactive.");
            }

            if (item.Product.Vendor == null || !item.Product.Vendor.IsVerified)
            {
                result.IsValid = false;
                result.Errors.Add($"Vendor for product '{item.Product.Name}' is unverified.");
            }

            if (item.Quantity > item.Product.Stock)
            {
                result.IsValid = false;
                result.Errors.Add($"Product '{item.Product.Name}' has insufficient stock. Requested: {item.Quantity}, Available: {item.Product.Stock}");
            }
        }

        return result;
    }
}
