using HyperLocal.Models.DTOs.Vendor;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HyperLocal.Interfaces;

public interface IVendorService
{
    Task<VendorResponse> CreateVendorAsync(Guid userId, CreateVendorRequest request);

    Task<VendorResponse?> GetMyStoreAsync(Guid userId);

    Task<VendorResponse> UpdateVendorAsync(Guid userId, UpdateVendorRequest request);

    Task<List<VendorResponse>> GetAllVendorsAsync();

    Task<VendorResponse> VerifyVendorAsync(Guid id);

    Task<bool> DeleteVendorAsync(Guid id);
}
