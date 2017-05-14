using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Driver;
using Services;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using System.Linq;
using System;
using MathNet.Numerics.Statistics;
using MathNet.Numerics.Distributions;
using MongoDB.Bson.Serialization;

[Route("api/statistics")]
public class StatisticsController : Controller
{
    private IMongoDatabase db;

    public StatisticsController(IMongoService mongoService)
    {
        this.db = mongoService.GetMongo();
    }

    [HttpGet]
    [Route("satisfaction")]
    public ActionResult Satisfaction()
    {
        var collection = db.GetCollection<Response>("responses");
        /*var filter = BsonDocument.Parse("{'responses.widgetID': 1}");
        var result = collection.Find(filter);
        var list = result.ToList();
        int[] array = new int[4];
        foreach (var i in list) {
            i[]
        }
        return Json(new {values=new int[]{}});*/
        /*var pipeline = new BsonDocument[] {
        new BsonDocument{{"$unwind", "$responses"}},
        new BsonDocument{{"$match", new BsonDocument {{"$widgetID", 1}} }} };
        pipeline = BsonDocument.Parse("[{$unwind: $responses},{},{}]");*/
        var aggregate = collection.Aggregate()
        .Unwind(x => x.Responses)
        .Match(new BsonDocument { { "responses.widgetID", 1 } })
        .Group(new BsonDocument { { "_id", "$responses.response" }, { "count", new BsonDocument("$sum", 1) } })
        .Sort(new BsonDocument { { "_id", 1 } });
        var list = aggregate.ToList();
        return Content(list.ToJson());
    }

    [HttpGet]
    [Route("summary")]
    public ActionResult Summary()
    {
        var collection = db.GetCollection<Response>("responses");
        var list = new List<double>();
        var summary = new List<double>();
        var aggregate = collection.Aggregate()
        .Unwind(x => x.Responses)
        .Match(new BsonDocument { { "responses.widgetID", 1 } });
        aggregate.ForEachAsync(doc => {
            WidgetResponse widgetResponse = BsonSerializer.Deserialize<WidgetResponse>(doc["responses"].AsBsonDocument);
            list.Add(Convert.ToDouble(widgetResponse.Response));
            Console.WriteLine(doc);
        }).Wait();

        summary.Add(list.Count);
        summary.AddRange(Statistics.FiveNumberSummary(list));
        var data = new DescriptiveStatistics(list);
        summary.Add(data.StandardDeviation);
        summary.Add(data.Variance);
        summary.Add(data.Skewness);
        summary.Add(data.Kurtosis);
        return Content(summary.ToJson());
    }
}