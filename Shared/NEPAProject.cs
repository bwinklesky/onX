using CsvHelper.Configuration;
using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Client.Data.Models
{
    public class NEPAProject
    {
        [Key]
        public int Id { get; set; }
        public string Number { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string Program { get; set; }
        public string LeadOffice { get; set; }
        public string FiscalYear { get; set; }
    }


    public sealed class FooMap : ClassMap<NEPAProject>
    {
        public FooMap()
        {            
            Map(m => m.Number).Name("NEPA #");
            Map(m => m.Name).Name("Project Name");
            Map(m => m.Status).Name("NEPA Status");
            Map(m => m.LeadOffice).Name("Lead Office");
            Map(m => m.FiscalYear).Name("Fiscal Year");
        }
    }

}
