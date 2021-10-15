using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace JebraAzureFunctions.Models
{
    class CustomNonQueryModel
    {
        [JsonProperty]
        public string command { get; set; }
    }
}
