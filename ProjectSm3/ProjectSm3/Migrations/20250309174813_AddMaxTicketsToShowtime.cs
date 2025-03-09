using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectSm3.Migrations
{
    /// <inheritdoc />
    public partial class AddMaxTicketsToShowtime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaxTickets",
                table: "Showtimes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxTickets",
                table: "Showtimes");
        }
    }
}
