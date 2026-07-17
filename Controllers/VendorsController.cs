using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Vendor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HyperLocal.Controllers;

[ApiController]
[Route("api/vendors")]
public class VendorsController : ControllerBase
{
    private readonly IVendorService _vendorService;

    public VendorsController(IVendorService vendorService)
    {
        _vendorService = vendorService;
    }

    [HttpPost("register")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Register([FromBody] CreateVendorRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var result = await _vendorService.CreateVendorAsync(userId, request);
        return CreatedAtAction(nameof(GetMyStore), null, result);
    }

    [HttpGet("my-store")]
    [Authorize(Roles = "Vendor,Customer")]
    public async Task<IActionResult> GetMyStore()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var result = await _vendorService.GetMyStoreAsync(userId);
        return Ok(result);
    }

    [HttpPut("my-store")]
    [Authorize(Roles = "Vendor,Customer")]
    public async Task<IActionResult> UpdateMyStore([FromBody] UpdateVendorRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var result = await _vendorService.UpdateVendorAsync(userId, request);
        return Ok(result);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var result = await _vendorService.GetAllVendorsAsync();
        return Ok(result);
    }

    [HttpPatch("{id:guid}/verify")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Verify(Guid id)
    {
        var result = await _vendorService.VerifyVendorAsync(id);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _vendorService.DeleteVendorAsync(id);
        return NoContent();
    }
}
