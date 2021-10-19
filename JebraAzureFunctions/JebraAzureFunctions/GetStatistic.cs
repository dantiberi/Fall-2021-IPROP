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
    public static class GetStatistic
    {
        [FunctionName("GetStatistic")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "Statistic Requests" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiRequestBodyAttribute(contentType: "string", bodyType: typeof(GetStatisticModel))]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string id = req.Query["id"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            //name = name ?? data?.name;

            /*
            string responseMessage = "";

            //See GetQuestion for some context here.
            var str = Environment.GetEnvironmentVariable("SqlConnectionString");
            using (SqlConnection conn = new SqlConnection(str))
            {
                conn.Open();
                var command = @$"SELECT statistic.id, first_time_correct, total_retries, score  FROM statistic, statistic_join
                WHERE statistic_join.user_id = {data?.user_id} 
                    AND statistic_join.stage_id = {data?.stage_id} 
                    AND statistic_join.course_id = {data?.course_id} 
                    AND statistic.id = statistic_join.statistic_id
                ";

                using (SqlCommand cmd = new SqlCommand(command, conn))
                {
                    SqlDataReader rows = await cmd.ExecuteReaderAsync();
                    responseMessage = Tools.SqlDatoToJson(rows);//Convert object to JSON.
                }
            }
            */

            var command = @$"SELECT statistic.id, first_time_correct, total_retries, score  FROM statistic, statistic_join
                WHERE statistic_join.user_id = {data?.user_id} 
                    AND statistic_join.stage_id = {data?.stage_id} 
                    AND statistic_join.course_id = {data?.course_id} 
                    AND statistic.id = statistic_join.statistic_id
                ";
            string responseMessage = Tools.ExecuteQueryAsync(command).GetAwaiter().GetResult();

            return new OkObjectResult(responseMessage);
        }
    }
}

