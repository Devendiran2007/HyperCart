using HyperLocal.Models.Enums;

namespace HyperLocal.Models.Entities;

public class User
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public Role Role { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    

    // Navigation
    public Vendor? Vendor { get; set; }

    public Cart? Cart { get; set; }

    public ICollection<Order> Orders { get; set; } = new List<Order>();

    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}