using System;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using JebraAzureFunctions.Models;
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
    public static class GetStatistics
    {
        [FunctionName("GetStatistics")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "Statistic Requests" })]
        [OpenApiParameter(name: "instructor_id", In = ParameterLocation.Query, Required = true, Type = typeof(int), Description = "The **instructor.id** parameter")]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string instructor_id = req.Query["instructor_id"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            var command = @$"
                SELECT statistic.id, statistic.score, subject.subject_name, app_user.email,
                statistic.correct_attempt, statistic.incorrect_attempt, statistic.game_date
                FROM statistic 
                INNER JOIN app_user ON
                statistic.user_id = app_user.id
                INNER JOIN subject ON
                statistic.subject_id = subject.id
                WHERE instructor_id = {instructor_id}
                ";
            string responseMessage = Tools.ExecuteQueryAsync(command).GetAwaiter().GetResult();

            return new OkObjectResult(responseMessage);
        }
    }
}

