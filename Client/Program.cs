using BlazorApp.Client;
using BlazorApp.Client.Data;
using BlazorApp.Client.Data.Models;
using CsvHelper;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.EntityFrameworkCore;
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

    // Post the data to the server's API endpoint
    //var response = await http.PostAsJsonAsync("Seed/seed-data", entities);
    //response.EnsureSuccessStatusCode();
}
catch (Exception ex)
{
    Console.WriteLine($"Error seeding data: {ex.Message}");
}

await app.RunAsync();

internal class DbSeeder
{
    internal static void SeedProducts(object contentRootPath, ApplicationDbContext context)
    {
        throw new NotImplementedException();
    }
}
