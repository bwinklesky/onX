using CsvHelper.Configuration;
using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Client.Data.Models
{
    public class NEPAProject
    {
        [Key]
        public int Id { get; set; }
        public string? Number { get; set; }
    }


    public sealed class FooMap : ClassMap<NEPAProject>
    {
        public FooMap()
        {
            //Map(m => m.Id).Name("ColumnA");
            Map(m => m.Number).Name("NEPA #");
        }
    }

}
