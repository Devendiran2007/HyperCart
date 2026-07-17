using HyperLocal.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace HyperLocal.Services;

public class ImageUploadService : IImageUploadService
{
    private readonly HttpClient _httpClient;
    private readonly string _supabaseUrl;
    private readonly string _supabaseKey;
    private readonly string _bucket;

    public ImageUploadService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _supabaseUrl = (configuration["Supabase:Url"] ?? "https://fzfihtuqftiydadfnvwq.supabase.co").TrimEnd('/');
        _supabaseKey = configuration["Supabase:ApiKey"] ?? "";
        _bucket = configuration["Supabase:Bucket"] ?? "products";
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folderPath)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("Uploaded file is empty or invalid.");
        }

        // 5MB Limit
        if (file.Length > 5 * 1024 * 1024)
        {
            throw new ArgumentException("Image file size must be 5MB or less.");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (extension != ".jpg" && extension != ".jpeg" && extension != ".png" && extension != ".webp")
        {
            throw new ArgumentException("Only .jpg, .jpeg, .png, and .webp formats are allowed.");
        }

        var fileName = $"{Guid.NewGuid()}{extension}";
        var relativePath = $"{folderPath.Trim('/')}/{fileName}";

        var requestUrl = $"{_supabaseUrl}/storage/v1/object/{_bucket}/{relativePath}";

        using var request = new HttpRequestMessage(HttpMethod.Post, requestUrl);
        
        // Add auth headers for Supabase API
        if (!string.IsNullOrEmpty(_supabaseKey))
        {
            request.Headers.Add("Authorization", $"Bearer {_supabaseKey}");
            request.Headers.Add("apikey", _supabaseKey);
        }

        using var stream = file.OpenReadStream();
        using var content = new StreamContent(stream);
        content.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType ?? "image/jpeg");
        request.Content = content;

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var errorMsg = await response.Content.ReadAsStringAsync();
            throw new Exception($"Failed to upload image to Supabase storage. StatusCode: {response.StatusCode}, Error: {errorMsg}");
        }

        // Return public URL
        return $"{_supabaseUrl}/storage/v1/object/public/{_bucket}/{relativePath}";
    }
}
