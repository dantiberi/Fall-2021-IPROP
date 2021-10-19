using System;
using System.Collections.Generic;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace JebraAzureFunctions
{
    class Tools
    {
        public Tools() { }

        /// <summary>
        /// Prints to Visual Studio debug console.
        /// </summary>
        /// <param name="s">String to print.</param>
        public static void PrintDebug(string s)
        {
            System.Diagnostics.Debug.WriteLine(s);
        }

        /// <summary>
        /// Coverts a SqlDataReader into a JSON object representing the query results.
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns>A JSON string representing the query results.</returns>
        public static String SqlDatoToJson(SqlDataReader dataReader)
        {
            var dataTable = new DataTable();
            dataTable.Load(dataReader);
            string JSONString = string.Empty;
            JSONString = JsonConvert.SerializeObject(dataTable);
            return JSONString;
        }

        /// <summary>
        /// Executes an async non-query command on the Azure sql database.
        /// </summary>
        /// <param name="command"></param>
        /// <returns>True if the command was sent.</returns>
        public static async Task<bool> ExecuteNonQueryAsync(string command)
        {
            var str = Environment.GetEnvironmentVariable("SqlConnectionString");
            using (SqlConnection conn = new SqlConnection(str))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(command, conn))
                {
                    int exeTask = await cmd.ExecuteNonQueryAsync();
                }
            }
            return true;
        }

    }
}
