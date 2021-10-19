using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace JebraAzureFunctions
{
    class QuestionModel : Attribute
    {
        [JsonProperty]
        public int id { get; set; }

        [JsonProperty]
        public string question { get; set; }

        [JsonProperty]
        public float answer_a { get; set; }

        [JsonProperty]
        public float answer_b { get; set; }
    }
}
