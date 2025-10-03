using CsvHelper.Configuration;
using NetTopologySuite.Geometries;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BlazorApp.Client.Data.Models
{
    public class Plan
    {

        [JsonPropertyName("GlobalID")]
        public string Id { get; set; }
        [JsonPropertyName("NEPAnum")]
        public string? Number { get; set; }
        public string? Name { get; set; }
        //[JsonPropertyName("NEPAnum")]
        public string? Status { get; set; }

        public bool IsApproved { get; set; }

        public Geometry Geometry { get; set; }

    }

        //"OBJECTID": 21,
        //"MapID": "N",
        //"MapType": "LUPRD",
        //"LUPName": "Newcastle & Nebraska RMPs Revision",
        //"Status": " ",
        //"RODdate": " ",
        //"ePLink": "https://eplanning.blm.gov/eplanning-ui/project/2013064/510",
        //"AdminSt": "WY",
        //"NEPAnum": "DOI-BLM-WY-P080-2021-0027-RMP-EIS",
        //"GlobalID": "63c813f5-82ff-46c1-93b6-ef50c624b735",
        //"created_user": "lgolon@blm.gov_BLM_EGIS",
        //"created_date": "Mon, 31 Mar 2025 20:33:04 GMT",
        //"last_edited_user": "lgolon@blm.gov_BLM_EGIS",
        //"last_edited_date": "Mon, 31 Mar 2025 20:33:04 GMT"

    public sealed class PlanMap : ClassMap<NEPAProject>
    {
        public PlanMap()
        {
            //Map(m => m.Id).Name("ColumnA");
            Map(m => m.Number).Name("NEPA #");
            Map(m => m.Name).Name("Project Name");
            Map(m => m.Status).Name("Status");
        }
    }

}
