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
    public static class UserCourseAssignment
    {
        [FunctionName("UserCourseAssignment")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "courseCode", In = ParameterLocation.Query, Required = true, Type = typeof(string), Description = "Course code.")]
        [OpenApiParameter(name: "userEmail", In = ParameterLocation.Query, Required = true, Type = typeof(string), Description = "The user's email.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
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
             * 1. Get course id from course code. *
             * 2. Get user id from email. *
             * 3. Get instructor id from course id. *?
             * 4. Insert into course_assignment.
             * 5. Set user online.
             */

            string courseIdS = Tools.ExecuteQueryAsync($"SELECT id FROM course WHERE code='{courseCode}'").GetAwaiter().GetResult();
            dynamic data = JsonConvert.DeserializeObject(courseIdS.Substring(1, courseIdS.Length - 2));//Removes [] from ends.
            int courseId = data?.id;

            string userIdS = Tools.ExecuteQueryAsync($"SELECT id FROM app_user WHERE email='{userEmail}'").GetAwaiter().GetResult();
            data = JsonConvert.DeserializeObject(userIdS.Substring(1, userIdS.Length - 2));//Removes [] from ends.
            int userId = data?.id;

            string instructorIds = Tools.ExecuteQueryAsync($"SELECT instructor_id FROM course_assignment WHERE course_id={courseId} AND user_id IS NULL").GetAwaiter().GetResult();
            data = JsonConvert.DeserializeObject(instructorIds.Substring(1, instructorIds.Length - 2));//Removes [] from ends.
            Console.WriteLine(instructorIds);
            int instructorId = data?.instructor_id;

            //Console.WriteLine($"courseId:{courseId}, userId:{userId}, instructorId:{instructorId}");

            string responseMessage = "DONE";
            return new OkObjectResult(responseMessage);
        }
    }
}

