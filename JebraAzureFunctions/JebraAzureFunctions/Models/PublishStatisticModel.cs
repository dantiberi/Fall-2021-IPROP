using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace JebraAzureFunctions.Models
{
    class PublishStatisticModel
    {
        [JsonProperty]
        public int user_id { get; set; }
        [JsonProperty]
        public int course_id { get; set; }
        [JsonProperty]
        public int stage_id { get; set; }
        [JsonProperty]
        public int first_time_correct { get; set; }
        [JsonProperty]
        public int total_retries { get; set; }
        [JsonProperty]
        public float score { get; set; }
    }
}
