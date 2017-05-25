using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;

namespace Models
{
    public class Response
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("UnitID")]
        public int UnitID { get; set; }

        [BsonElement("SurveyID")]
        public string SurveyID { get; set; }

        [BsonElement("Hours")]
        public int Hours { get; set; }

        [BsonElement("Minutes")]
        public int Minutes { get; set; }

        [BsonElement("Seconds")]
        public int Seconds { get; set; }

        [BsonElement("Day")]
        public int Day { get; set; }

        [BsonElement("Month")]
        public int Month { get; set; }

        [BsonElement("Year")]
        public int Year { get; set; }

        [BsonElement("responses")]
        public List<WidgetResponse> Responses { get; set; }
    }

    public class WidgetResponse
    {
        [BsonElement("widgetTypeID")]
        public string WidgetTypeId { get; set; }

        [BsonElement("widgetID")]
        public string WidgetId { get; set; }

        [BsonElement("responseID")]
        public string ResponseId { get; set; }
    }
}