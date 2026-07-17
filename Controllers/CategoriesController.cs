using HyperLocal.Helpers;
using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Category;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HyperLocal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
         {
            var result = await _categoryService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (DuplicateCategoryException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentNullException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var result = await _categoryService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var result = await _categoryService.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound(new { message = $"Category with ID {id} was not found." });
            }
            return Ok(result);
        }
        catch (CategoryNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _categoryService.UpdateAsync(id, request);
            if (result == null)
            {
                return NotFound(new { message = $"Category with ID {id} was not found." });
            }
            return Ok(result);
        }
        catch (CategoryNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (DuplicateCategoryException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentNullException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _categoryService.DeleteAsync(id);
            return NoContent();
        }
        catch (CategoryNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
