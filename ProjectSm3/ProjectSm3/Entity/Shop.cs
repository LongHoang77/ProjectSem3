using System;
using System.ComponentModel.DataAnnotations;

namespace ProjectSm3.Entity
{
    public class Shop
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(200)]
        public string Location { get; set; }

        public DateTime OpenTime { get; set; }

        public DateTime CloseTime { get; set; }

        [StringLength(100)]
        public string OwnerName { get; set; }

        [StringLength(20)]
        public string ContactNumber { get; set; }
    }
}