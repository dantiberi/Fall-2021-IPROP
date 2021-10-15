using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace JebraAzureFunctions.Models
{
    class PublishStageEventModel
    {
        [JsonProperty]
        public int stage_id { get; set; }
        [JsonProperty]
        public int course_id { get; set; }
        [JsonProperty]
        public int origin_user_id { get; set; }
        [JsonProperty]
        public int question_id { get; set; }
        [JsonProperty]
        public int inflicted_hp { get; set; }
        [JsonProperty]
        public int was_correct { get; set; }
        [JsonProperty]
        public string event_time { get; set; }
    }
}
