using HyperLocal.Models.DTOs.Category;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HyperLocal.Interfaces;

public interface ICategoryService
{
    Task<CategoryResponse> CreateAsync(CreateCategoryRequest request);

    Task<List<CategoryResponse>> GetAllAsync();

    Task<CategoryResponse?> GetByIdAsync(Guid id);

    Task<CategoryResponse?> UpdateAsync(Guid id, UpdateCategoryRequest request);

    Task<bool> DeleteAsync(Guid id);
}
