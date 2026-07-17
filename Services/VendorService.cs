using HyperLocal.Data;
using HyperLocal.Helpers;
using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Vendor;
using HyperLocal.Models.Entities;
using HyperLocal.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HyperLocal.Services;

public class VendorService : IVendorService
{
    private readonly ApplicationDbContext _context;

    public VendorService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<VendorResponse> CreateVendorAsync(Guid userId, CreateVendorRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request), "Request cannot be null.");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        if (user.Role != Role.Customer)
        {
            throw new InvalidOperationException("Only authenticated Customers can create a vendor account.");
        }

        var storeExists = await _context.Vendors.AnyAsync(v => v.UserId == userId);
        if (storeExists)
        {
            throw new DuplicateVendorException("One user can own only one store.");
        }

        var vendor = new Vendor
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            StoreName = request.StoreName,
            Description = request.Description,
            LogoUrl = request.LogoUrl,
            Address = request.Address,
            Latitude = request.Latitude ?? 0,
            Longitude = request.Longitude ?? 0,
            DeliveryRadiusKm = request.DeliveryRadiusKm,
            IsVerified = false,
            CreatedAt = DateTime.UtcNow
        };

        // Upgrade the user's role to Vendor
        user.Role = Role.Vendor;

        _context.Vendors.Add(vendor);
        await _context.SaveChangesAsync();

        return new VendorResponse
        {
            Id = vendor.Id,
            UserId = vendor.UserId,
            StoreName = vendor.StoreName,
            Description = vendor.Description,
            LogoUrl = vendor.LogoUrl,
            Address = vendor.Address,
            Latitude = vendor.Latitude,
            Longitude = vendor.Longitude,
            DeliveryRadiusKm = vendor.DeliveryRadiusKm,
            IsVerified = vendor.IsVerified,
            CreatedAt = vendor.CreatedAt
        };
    }

    public async Task<VendorResponse?> GetMyStoreAsync(Guid userId)
    {
        var vendor = await _context.Vendors
            .Where(v => v.UserId == userId)
            .Select(v => new VendorResponse
            {
                Id = v.Id,
                UserId = v.UserId,
                StoreName = v.StoreName,
                Description = v.Description,
                LogoUrl = v.LogoUrl,
                Address = v.Address,
                Latitude = v.Latitude,
                Longitude = v.Longitude,
                DeliveryRadiusKm = v.DeliveryRadiusKm,
                IsVerified = v.IsVerified,
                CreatedAt = v.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (vendor == null)
        {
            throw new VendorNotFoundException($"Store for user with ID {userId} was not found.");
        }

        return vendor;
    }

    public async Task<VendorResponse> UpdateVendorAsync(Guid userId, UpdateVendorRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request), "Request cannot be null.");
        }

        var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == userId);
        if (vendor == null)
        {
            throw new VendorNotFoundException($"Store for user with ID {userId} was not found.");
        }

        vendor.StoreName = request.StoreName;
        vendor.Description = request.Description;
        vendor.LogoUrl = request.LogoUrl;
        vendor.Address = request.Address;
        vendor.Latitude = request.Latitude ?? 0;
        vendor.Longitude = request.Longitude ?? 0;
        vendor.DeliveryRadiusKm = request.DeliveryRadiusKm;

        await _context.SaveChangesAsync();

        return new VendorResponse
        {
            Id = vendor.Id,
            UserId = vendor.UserId,
            StoreName = vendor.StoreName,
            Description = vendor.Description,
            LogoUrl = vendor.LogoUrl,
            Address = vendor.Address,
            Latitude = vendor.Latitude,
            Longitude = vendor.Longitude,
            DeliveryRadiusKm = vendor.DeliveryRadiusKm,
            IsVerified = vendor.IsVerified,
            CreatedAt = vendor.CreatedAt
        };
    }

    public async Task<List<VendorResponse>> GetAllVendorsAsync()
    {
        return await _context.Vendors
            .Select(v => new VendorResponse
            {
                Id = v.Id,
                UserId = v.UserId,
                StoreName = v.StoreName,
                Description = v.Description,
                LogoUrl = v.LogoUrl,
                Address = v.Address,
                Latitude = v.Latitude,
                Longitude = v.Longitude,
                DeliveryRadiusKm = v.DeliveryRadiusKm,
                IsVerified = v.IsVerified,
                CreatedAt = v.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<VendorResponse> VerifyVendorAsync(Guid id)
    {
        var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.Id == id);
        if (vendor == null)
        {
            throw new VendorNotFoundException($"Vendor with ID {id} was not found.");
        }

        vendor.IsVerified = true;
        await _context.SaveChangesAsync();

        return new VendorResponse
        {
            Id = vendor.Id,
            UserId = vendor.UserId,
            StoreName = vendor.StoreName,
            Description = vendor.Description,
            LogoUrl = vendor.LogoUrl,
            Address = vendor.Address,
            Latitude = vendor.Latitude,
            Longitude = vendor.Longitude,
            DeliveryRadiusKm = vendor.DeliveryRadiusKm,
            IsVerified = vendor.IsVerified,
            CreatedAt = vendor.CreatedAt
        };
    }

    public async Task<bool> DeleteVendorAsync(Guid id)
    {
        var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.Id == id);
        if (vendor == null)
        {
            throw new VendorNotFoundException($"Vendor with ID {id} was not found.");
        }

        // Revert user role back to Customer
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == vendor.UserId);
        if (user != null && user.Role == Role.Vendor)
        {
            user.Role = Role.Customer;
        }

        _context.Vendors.Remove(vendor);
        await _context.SaveChangesAsync();

        return true;
    }
}
