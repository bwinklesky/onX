using BlazorApp.Client;
using BlazorApp.Client.Data;
using BlazorApp.Shared;
using CsvHelper;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using Newtonsoft.Json;
using System.Globalization;
using System.Net.Http.Json;
using System.Xml;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("nepa"));

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.Configuration["API_Prefix"] ?? builder.HostEnvironment.BaseAddress) });

var app = builder.Build();

var env = app.Services.GetRequiredService<IWebAssemblyHostEnvironment>();

// Seed the database


builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
var http = new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) };

try
{
    // Read the CSV file from the client's wwwroot folder
    var csvContent = await http.GetStringAsync("SearchResults.csv");
    using var reader = new StringReader(csvContent);
    using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
    csv.Context.RegisterClassMap<FooMap>();
    var entities = csv.GetRecords<NEPAProject>().ToList();

    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        foreach (var entity in entities)
        {
            context.NEPAProjects.Add(entity);
        }

        await context.SaveChangesAsync();

        // Ensure the database is created and migrations are applied
        //context.Database.Migrate();

        // Call the seeding method
        //DbSeeder.SeedProducts(env.ContentRootPath, context);
    }


    var serializer = GeoJsonSerializer.Create();
    var development = await http.GetStringAsync("BLM_Natl_Revision_Development_Land_Use_Plans_7679825753955010227.geojson");

    using var developmentReader = new StringReader(development);

    var test = developmentReader.ReadToEnd();

    // Create a GeoJsonReader
    var geoJsonReader = new GeoJsonReader();

    //var featureCollection = reader.Read<NetTopologySuite.Features.FeatureCollection>(jsonReader);
    // Deserialize the GeoJSON string to an NTS Geometry object
    var features = geoJsonReader.Read<NetTopologySuite.Features.FeatureCollection>(test); // Or use Read<FeatureCollection>(geoJson)

    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        foreach (var feature in features)
        {
            Console.WriteLine(feature);

            var id = (string)feature.Attributes["GlobalID"];

            var plan = new Plan()
            {
                Id = id.ToString(),
                Number = (string)feature.Attributes["NEPAnum"],
                Name = (string)feature.Attributes["LUPName"],
                Status = (string)feature.Attributes["Status"],
                ePLink = (string)feature.Attributes["ePLink"],
                Geometry = feature.Geometry
            };

            context.Plans.Add(plan);

        }

        await context.SaveChangesAsync();

    }


    // Post the data to the server's API endpoint
    //var response = await http.PostAsJsonAsync("Seed/seed-data", entities);
    //response.EnsureSuccessStatusCode();
}
catch (Exception ex)
{
    Console.WriteLine($"Error seeding data: {ex.Message}");
}

await app.RunAsync();

