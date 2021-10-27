using System;
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
    public static class UserSignIn
    {
        [FunctionName("UserSignIn")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "General Request" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "courseCode", In = ParameterLocation.Query, Required = true, Type = typeof(string), Description = "Course code.")]
        [OpenApiParameter(name: "userEmail", In = ParameterLocation.Query, Required = true, Type = typeof(string), Description = "The user's email.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string courseCode = req.Query["courseCode"];
            string userEmail = req.Query["userEmail"];

            /*
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;
            */

            /*
             * Inputs: An email and corse code.
             * 1. Get course id from course code. *
             * 2. Get user id from email. *
             * 3. Get instructor id from course id. *?
             * 4. Insert into course_assignment.
             * 5. Set user online.
             */

            string courseIdS = Tools.ExecuteQueryAsync($"SELECT id FROM course WHERE code='{courseCode}'").GetAwaiter().GetResult();
            dynamic data = JsonConvert.DeserializeObject(courseIdS.Substring(1, courseIdS.Length - 2));//Removes [] from ends.
            int courseId = data?.id;

            //string userIdS = Tools.ExecuteQueryAsync($"SELECT id FROM app_user WHERE email='{userEmail}'").GetAwaiter().GetResult();
            string userIdS = Tools.ExecuteQueryAsync($@"
                IF EXISTS
                (
                    SELECT id FROM app_user WHERE email='{userEmail}'
                )
                    BEGIN
                        UPDATE app_user SET is_online=1 WHERE email='{userEmail}'
                    END
                ELSE
                    INSERT INTO app_user VALUES('{userEmail}', 1)
                
                SELECT id FROM app_user WHERE email='{userEmail}'
            ").GetAwaiter().GetResult();
            data = JsonConvert.DeserializeObject(userIdS.Substring(1, userIdS.Length - 2));//Removes [] from ends.
            int userId = data?.id;

            string instructorIds = Tools.ExecuteQueryAsync($"SELECT instructor_id FROM course_assignment WHERE course_id={courseId} AND user_id IS NULL").GetAwaiter().GetResult();
            data = JsonConvert.DeserializeObject(instructorIds.Substring(1, instructorIds.Length - 2));//Removes [] from ends.
            int instructorId = data?.instructor_id;

            //Console.WriteLine($"courseId:{courseId}, userId:{userId}, instructorId:{instructorId}");

            await Tools.ExecuteNonQueryAsync($"INSERT INTO course_assignment (user_id, course_id, instructor_id) VALUES({userId},{courseId},{instructorId})");

            string responseMessage = $"User Signed-in: courseId: { courseId}, userId: { userId}, instructorId: { instructorId}";
            return new OkObjectResult(responseMessage);
        }
    }
}

