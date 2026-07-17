using System.Collections.Generic;

namespace HyperLocal.Models.DTOs.Recommendation;

public class NvidiaChatResponse
{
    public List<Choice>? Choices { get; set; }
}

public class Choice
{
    public Message? Message { get; set; }
}

public class Message
{
    public string? Content { get; set; }
}
