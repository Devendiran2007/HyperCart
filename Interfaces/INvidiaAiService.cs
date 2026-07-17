using System.Threading.Tasks;

namespace HyperLocal.Interfaces;

public interface INvidiaAiService
{
    Task<string> GenerateCompletionAsync(string prompt);
}
