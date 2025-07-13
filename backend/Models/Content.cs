using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace Lms_Online.Models
{
    public class Content
    {
        [Key]
        public int ContentId { get; set; }

        [Required]
        [ForeignKey("CoursePresent")]
        public int CoursePresentId { get; set; }

        [Required]
        [StringLength(50)]
        public string ContentType { get; set; }

        [Required]
        [StringLength(255)]
        public string ContentURL { get; set; }

        
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [StringLength(255)]
        public string Description { get; set; }

        public virtual CoursePresent CoursePresent { get; set; }

        // This property converts CreatedDate to Solar Hijri format
        [NotMapped]
        public string CreatedDateSolar => ConvertToSolarHijri(CreatedDate);

        private string ConvertToSolarHijri(DateTime date)
        {
            PersianCalendar persianCalendar = new PersianCalendar();
            int year = persianCalendar.GetYear(date);
            int month = persianCalendar.GetMonth(date);
            int day = persianCalendar.GetDayOfMonth(date);
            return $"{year}/{month:D2}/{day:D2}";
        }
    }
}
