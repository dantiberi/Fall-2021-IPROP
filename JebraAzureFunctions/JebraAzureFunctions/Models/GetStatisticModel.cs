using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace JebraAzureFunctions.Models
{
    class GetStatisticModel
    {
        [JsonProperty]
        public int user_id { get; set; }
        [JsonProperty]
        public int course_id { get; set; }
        [JsonProperty]
        public int stage_id { get; set; }
    }
}
