using CsvHelper.Configuration;
using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Shared
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
        public string Start { get; set; }
        public string End { get; set; }
    }


    public sealed class NEPAMap : ClassMap<NEPAProject>
    {
        public NEPAMap()
        {            
            Map(m => m.Number).Name("NEPA #");
            Map(m => m.Name).Name("Project Name");
            Map(m => m.Status).Name("NEPA Status");
            Map(m => m.LeadOffice).Name("Lead Office");
            Map(m => m.FiscalYear).Name("Fiscal Year");
            Map(m => m.Start).Name("Start");
            Map(m => m.End).Name("End");
        }
    }

}
