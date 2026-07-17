using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HyperLocal.Migrations
{
    /// <inheritdoc />
    public partial class AddVendorLocationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeliveryRadiusKm",
                table: "Vendors",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Vendors",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Vendors",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeliveryRadiusKm",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Vendors");
        }
    }
}
