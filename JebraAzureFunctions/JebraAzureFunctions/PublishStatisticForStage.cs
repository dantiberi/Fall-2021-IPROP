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
    /// <summary>
    /// When calling this function, you are required to provide values for each column asked of in the model.
    /// This means that in order to update one field, such a score, you must first retrieve the existing values
    /// of the other fields, first_time_correct and total_retries, in order to not overwrite the existing values.
    /// </summary>
    public static class PublishStatisticForStage
    {
        [FunctionName("PublishStatisticForStage")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "Statistic Requests" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiRequestBodyAttribute(contentType: "string", bodyType: typeof(PublishStatisticModel))]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = null)] HttpRequest req,
            ILogger log)
        {
            //log.LogInformation("C# HTTP trigger function processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            //name = name ?? data?.name;

            string command = $@"
                ALTER TABLE [dbo].[statistic_join] CHECK CONSTRAINT user_id_fk_on_statistic_join
                ALTER TABLE [dbo].[statistic_join] NOCHECK CONSTRAINT course_id_fk_on_statistic_join
                ALTER TABLE [dbo].[statistic_join] NOCHECK CONSTRAINT stage_id_fk_on_statistic_join
                ALTER TABLE [dbo].[statistic_join] NOCHECK CONSTRAINT statistic_id_fk_on_statistic_join
    
                IF NOT EXISTS ( SELECT user_id FROM statistic_join 
                    WHERE statistic_join.user_id = {data?.user_id} )
                BEGIN
                    INSERT INTO statistic (first_time_correct, total_retries, score)
                    OUTPUT {data?.user_id}, {data?.course_id},{data?.stage_id}, inserted.id INTO statistic_join(user_id, course_id, stage_id, statistic_id)
                    VALUES ({data?.first_time_correct},{data?.total_retries},{data?.score})
                END
                ELSE
                BEGIN
                    UPDATE statistic
                    SET first_time_correct = {data?.first_time_correct},
                        total_retries = {data?.total_retries},
                        score = {data?.score}
                    FROM statistic, statistic_join
                    WHERE statistic_join.user_id = {data?.user_id} 
                        AND statistic_join.stage_id = {data?.stage_id} 
                        AND statistic_join.course_id = {data?.course_id} 
                        AND statistic.id = statistic_join.statistic_id
                END   

                ALTER TABLE [dbo].[statistic_join] CHECK CONSTRAINT statistic_id_fk_on_statistic_join
                ALTER TABLE [dbo].[statistic_join] CHECK CONSTRAINT stage_id_fk_on_statistic_join
                ALTER TABLE [dbo].[statistic_join] CHECK CONSTRAINT course_id_fk_on_statistic_join
                ALTER TABLE [dbo].[statistic_join] CHECK CONSTRAINT user_id_fk_on_statistic_join
            ";
            await Tools.ExecuteNonQueryAsync(command);

            //INSERT INTO statistic_join VALUES({data?.user_id},{data?.course_id},{data?.stage_id},{data?.})
            string responseMessage = "Request Sent";

            return new OkObjectResult(responseMessage);
        }
    }
}

