using HyperLocal.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace HyperLocal.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Vendor> Vendors => Set<Vendor>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    base.OnModelCreating(modelBuilder);

    // User ↔ Vendor (One-to-One)
    modelBuilder.Entity<User>()
        .HasOne(u => u.Vendor)
        .WithOne(v => v.User)
        .HasForeignKey<Vendor>(v => v.UserId);

    // User ↔ Cart (One-to-One)
    modelBuilder.Entity<User>()
        .HasOne(u => u.Cart)
        .WithOne(c => c.User)
        .HasForeignKey<Cart>(c => c.UserId);

    // Vendor ↔ Products
    modelBuilder.Entity<Vendor>()
        .HasMany(v => v.Products)
        .WithOne(p => p.Vendor)
        .HasForeignKey(p => p.VendorId)
        .OnDelete(DeleteBehavior.Cascade);

    // Category ↔ Products
    modelBuilder.Entity<Category>()
        .HasMany(c => c.Products)
        .WithOne(p => p.Category)
        .HasForeignKey(p => p.CategoryId);

    // Product ↔ Images
    modelBuilder.Entity<Product>()
        .HasMany(p => p.Images)
        .WithOne(i => i.Product)
        .HasForeignKey(i => i.ProductId);

    // Product ↔ Reviews
    modelBuilder.Entity<Product>()
        .HasMany(p => p.Reviews)
        .WithOne(r => r.Product)
        .HasForeignKey(r => r.ProductId);

    // Cart ↔ CartItems
    modelBuilder.Entity<Cart>()
        .HasMany(c => c.CartItems)
        .WithOne(ci => ci.Cart)
        .HasForeignKey(ci => ci.CartId);

    // Order ↔ OrderItems
    modelBuilder.Entity<Order>()
        .HasMany(o => o.OrderItems)
        .WithOne(oi => oi.Order)
        .HasForeignKey(oi => oi.OrderId);
    }
}