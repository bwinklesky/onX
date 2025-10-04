using BlazorApp.Shared;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Xml;

namespace BlazorApp.Client.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlite("Data Source=mydatabase.db"); // Connection string


        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<NEPAProject>().HasData(
                new NEPAProject { Id = 1 },
                new NEPAProject { Id = 2 }
            );

            //var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            //{
            //    HasHeaderRecord = true // Set to false if no header row
            //};

            //using (var reader = new StreamReader("SearchResults.csv"))
            //using (var csv = new CsvReader(reader, config))
            //{
            //    var records = csv.GetRecords<NEPAProject>().ToList();
            //    // 'records' now contains a list of objects populated from the CSV
            //}

        }

        public DbSet<NEPAProject> NEPAProjects { get; set; }
        public DbSet<Plan> Plans { get; set; }


    }
}
