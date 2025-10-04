using BlazorApp.Client.Data.Models;
using BlazorApp.Shared;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PuppeteerSharp;
//using PuppeteerSharp.Dom;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Api
{
    public class PlansFunction
    {
        private readonly ILogger _logger;

        public PlansFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<PlansFunction>();
        }

        [Function("Plans")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
        {
            var randomNumber = new Random();
            var temp = 0;

            var serviceUrl = "https://services1.arcgis.com/KbxwQRRfWyEYLgp4/arcgis/rest/services/BLM_Natl_Land_Use_Plans_Approved_2022/FeatureServer/1";

            var url = "https://services1.arcgis.com/KbxwQRRfWyEYLgp4/arcgis/rest/services/BLM_Natl_Land_Use_Plans_Approved_2022/FeatureServer/1/query?f=json&returnIdsOnly=false&returnCountOnly=false&outFields=*&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1%20AND%201%3D1";

            var client = new HttpClient();

            var responseMessage = await client.GetAsync(url);

            List<Plan> results = new List<Plan>();

            if (responseMessage.IsSuccessStatusCode)
            {
                var content = await responseMessage.Content.ReadAsStringAsync();

                var data = JsonSerializer.Deserialize<JsonObject>(content);

                var features = data["features"].AsArray();

                foreach(var feature in features)
                {
                    var plan = feature["attributes"].Deserialize<Plan>();

                    var link = plan.ePLink;

                    //var browserFetcher = new BrowserFetcher();
                    //await browserFetcher.DownloadAsync();
                    //await using var browser = await Puppeteer.LaunchAsync(
                    //    new LaunchOptions { Headless = true });
                    //await using var page = await browser.NewPageAsync();
                    //await page.GoToAsync(link);

                    //var specificElementText = await page.EvaluateFunctionAsync<string>("(selector) => document.querySelector(selector).textContent", "#content");

                    //if(specificElementText != null)
                    //{
                    //    if (specificElementText.Contains("comment period", StringComparison.InvariantCultureIgnoreCase))
                    //    {
                    //        Console.WriteLine("BOB");
                    //    }
                    //}

                    results.Add(plan);

                }

            }




            var response = req.CreateResponse(HttpStatusCode.OK);
            response.WriteAsJsonAsync(results);

            return response;
        }

      
    }
}
