using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;

namespace JebraAzureFunctions
{
    public static class GenerateTestingQuestions
    {
        [FunctionName("GenerateTestingQuestions")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "Development Requests" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "number", In = ParameterLocation.Query, Required = true, Type = typeof(string), Description = "Number of questions to generate.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {

            string amountS = req.Query["number"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            amountS = amountS ?? data?.number;
            int amount = int.Parse(amountS);

            Random r = new Random();
            for (int i = 0; i < amount; i++)
            {
                //factor * x + sumNum = eNum
                int eNum = 0;
                int sumNum = 0;
                List<int> possibleFactors = new List<int>();
                while (possibleFactors.Count < 1)
                {
                    eNum = r.Next(0, 200);
                    sumNum = r.Next(-100, 100);

                    int n = eNum - sumNum;

                    for (int j = 1; j <= n; j++)//Get all round divisors and randomly pick one to be what x gets multiplied by.
                    {
                        if (n % j == 0)
                        {
                            possibleFactors.Add(j);
                        }
                    }
                }         

                int factor = possibleFactors[r.Next(0, possibleFactors.Count - 1)];
                int x = (eNum - sumNum) / factor;

                string command = "";

                if(sumNum < 0)
                {
                    int sumNumB = sumNum * -1;
                    command = $"INSERT INTO question(answer_a, answer_b, question) VALUES({x},null,'{factor}X - {sumNumB} = {eNum}')";
                }
                else
                {
                    command = $"INSERT INTO question(answer_a, answer_b, question) VALUES({x},null,'{factor}X + {sumNum} = {eNum}')";
                }
                //Run SQL Delete
                var str = Environment.GetEnvironmentVariable("SqlConnectionString");
                using (SqlConnection conn = new SqlConnection(str))
                {
                    conn.Open();

                    using (SqlCommand cmd = new SqlCommand(command, conn))
                    {
                        int exeTask = await cmd.ExecuteNonQueryAsync();
                    }
                }
            }

            string responseMessage = $"A request to add {amount} questions for development testing has been sent.";

            return new OkObjectResult(responseMessage);
        }
    }
}

