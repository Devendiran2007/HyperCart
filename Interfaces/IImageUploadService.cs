using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace HyperLocal.Interfaces;

public interface IImageUploadService
{
    Task<string> UploadImageAsync(IFormFile file, string folderPath);
}
