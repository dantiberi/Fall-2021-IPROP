using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace JebraAzureFunctions.Models
{
    ////Statistic: id score subject_id user_id correct_attempt incorrect_attempt game_date
    class StatisticModel : Attribute
    {
        [JsonProperty]
        public int id { get; set; }
        [JsonProperty]
        public int score { get; set; }
        [JsonProperty]
        public int subject_id { get; set; }
        [JsonProperty]
        public int user_id { get; set; }
        [JsonProperty]
        public int correct_attempt { get; set; }
        [JsonProperty]
        public int incorrect_attempt { get; set; }
        [JsonProperty]
        public string game_date { get; set; }
        [JsonProperty]
        public int instructor_id { get; set; }
       

    }
}
