using HyperLocal.Interfaces;
using HyperLocal.Models.DTOs.Recommendation;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace HyperLocal.Services;

public class NvidiaAiService : INvidiaAiService
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;
    private readonly string _apiKey;
    private readonly string _model;

    public NvidiaAiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _baseUrl = (configuration["Nvidia:BaseUrl"] ?? "https://integrate.api.nvidia.com/v1").TrimEnd('/');
        _apiKey = configuration["Nvidia:ApiKey"] ?? "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";
        _model = configuration["Nvidia:Model"] ?? "nvidia/nemotron-3-ultra-550b-a55b";
    }

    public async Task<string> GenerateCompletionAsync(string prompt)
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            throw new InvalidOperationException("Nvidia AI API Key is not configured.");
        }

        var url = $"{_baseUrl}/chat/completions";

        var payload = new
        {
            model = _model,
            messages = new[]
            {
                new { role = "user", content = prompt }
            },
            temperature = 0.7,
            top_p = 0.95
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        request.Content = JsonContent.Create(payload);

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"Nvidia AI completions API call failed. StatusCode: {response.StatusCode}, Error: {error}");
        }

        var chatResponse = await response.Content.ReadFromJsonAsync<NvidiaChatResponse>();
        var content = chatResponse?.Choices?[0]?.Message?.Content;

        return content ?? string.Empty;
    }
}
