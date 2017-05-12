using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;

namespace Models
{
    public class Response
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("Owner")]
        public string Owner { get; set; }

        [BsonElement("responses")]
        public List<WidgetResponse> Responses { get; set; }
    }

    public class WidgetResponse
    {
        [BsonElement("widgetID")]
        public int WidgetId { get; set; }

        [BsonElement("QuestionID")]
        public int QuestionId { get; set; }

        [BsonElement("responseID")]
        public int ResponseId { get; set; }

        [BsonElement("response")]
        public string Response { get; set; }
    }
}