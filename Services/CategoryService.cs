using HyperLocal.Data;
using HyperLocal.Helpers;
using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Category;
using HyperLocal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HyperLocal.Services;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _context;

    public CategoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request), "Request cannot be null.");
        }

        var nameExists = await _context.Categories
            .AnyAsync(c => c.Name.ToLower() == request.Name.ToLower());
        
        if (nameExists)
        {
            throw new DuplicateCategoryException($"Category with name '{request.Name}' already exists.");
        }

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            ImageUrl = request.ImageUrl
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            ImageUrl = category.ImageUrl
        };
    }

    public async Task<List<CategoryResponse>> GetAllAsync()
    {
        return await _context.Categories
            .Select(c => new CategoryResponse
            {
                Id = c.Id,
                Name = c.Name,
                ImageUrl = c.ImageUrl
            })
            .ToListAsync();
    }

    public async Task<CategoryResponse?> GetByIdAsync(Guid id)
    {
        var category = await _context.Categories
            .Select(c => new CategoryResponse
            {
                Id = c.Id,
                Name = c.Name,
                ImageUrl = c.ImageUrl
            })
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            throw new CategoryNotFoundException($"Category with ID {id} was not found.");
        }

        return category;
    }

    public async Task<CategoryResponse?> UpdateAsync(Guid id, UpdateCategoryRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request), "Request cannot be null.");
        }

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            throw new CategoryNotFoundException($"Category with ID {id} was not found.");
        }

        if (!string.Equals(category.Name, request.Name, StringComparison.OrdinalIgnoreCase))
        {
            var nameExists = await _context.Categories
                .AnyAsync(c => c.Name.ToLower() == request.Name.ToLower());
            
            if (nameExists)
            {
                throw new DuplicateCategoryException($"Category with name '{request.Name}' already exists.");
            }
        }

        category.Name = request.Name;
        category.ImageUrl = request.ImageUrl;

        await _context.SaveChangesAsync();

        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            ImageUrl = category.ImageUrl
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            throw new CategoryNotFoundException($"Category with ID {id} was not found.");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return true;
    }
}
