using System.IO;
using System;
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
using System.Data.SqlClient;

namespace JebraAzureFunctions
{
    public static class GetQuestion
    {
        [FunctionName("GetQuestion")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "Question Requests" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "id", In = ParameterLocation.Query, Required = true, Type = typeof(string), Description = "The **id** parameter")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            //log.LogInformation("C# HTTP trigger function processed a request.");
            //Console.WriteLine("GetQuestion Called!");

            string id = req.Query["id"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            id = id ?? data?.id;//Get id from url

            string responseMessage = "";

            //I've tried so hard to make this into a method in another class (Tools)
            //which could be easily called in a more clean/elegant way.
            //I just can't get the async/await stuff to work properly.
            //I spent an entire day on this. It's driving me insane!
            //-Dan Tiberi 10/3/2021 10:11pm. Send help... :(
            /*
            var str = Environment.GetEnvironmentVariable("SqlConnectionString");
            using (SqlConnection conn = new SqlConnection(str))
            {
                conn.Open();
                var command = $"SELECT question.id, question.answer_a, question.answer_b, question.question, subject.subject_name FROM question, subject WHERE question.id={id} AND subject.id = question.subject_id";

                using (SqlCommand cmd = new SqlCommand(command, conn))
                {
                    SqlDataReader rows = await cmd.ExecuteReaderAsync();
                    responseMessage = Tools.SqlDatoToJson(rows);//Convert object to JSON.
                }
            }
            */

            string command = $"SELECT question.id, question.answer_a, question.answer_b, question.question, subject.subject_name FROM question, subject WHERE question.id={id} AND subject.id = question.subject_id";

            responseMessage = Tools.ExecuteQueryAsync(command).GetAwaiter().GetResult();
            return new OkObjectResult(responseMessage);
        }
    }
}

