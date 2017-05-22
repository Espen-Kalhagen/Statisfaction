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
using Data;

[Route("api/statistics")]
public class StatisticsController : Controller
{
    private IMongoDatabase mdb;
    private ApplicationDbContext rdb;

    public StatisticsController(IMongoService mongoService, ApplicationDbContext rdb)
    {
        this.mdb = mongoService.GetMongo();
        this.rdb = rdb;
    }

    [HttpGet]
    [Route("satisfaction")]
    public ActionResult Satisfaction()
    {
        var collection = mdb.GetCollection<Response>("responses");
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
        var collection = mdb.GetCollection<Response>("responses");
        var list = new List<double>();
        var summary = new List<double>();
        var aggregate = collection.Aggregate()
        .Unwind(x => x.Responses)
        .Match(new BsonDocument { { "responses.widgetID", 1 } });
        aggregate.ForEachAsync(doc => {
            WidgetResponse widgetResponse = BsonSerializer.Deserialize<WidgetResponse>(doc["responses"].AsBsonDocument);
            list.Add(Convert.ToDouble(widgetResponse.ResponseId));
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

    [HttpGet]
    [Route("unit/{unitId}")]
    // URI: api/statistics/unit/1?date=1993/01/01
    public ActionResult QuestionStatistics(int unitId, string date)
    {
        if (date == null) return BadRequest();

        // Get the date from the uri and do error handlign
        string[] splitdate = date.Split('/');
        int year = 0, month = 0, day = 0;
        bool success = true;
        if (splitdate.Count() == 3) {
            success = Int32.TryParse(splitdate[0], out year);
            success &= (year >= 1970 && year <= 9999);
            success &= Int32.TryParse(splitdate[1], out month);
            success &= (month >= 1 && month <= 12);
            success &= Int32.TryParse(splitdate[2], out day);
            success &= (day >= 1 && day <= 31);
        }
        if (!success) return BadRequest();

        // Finds the survey id for the selected unit
        var unit = rdb.StoreUnits.FirstOrDefault(c => c.id == unitId);
        if (unit == null) return BadRequest();
        var surveyId = unit.SurveyID;

        // Gets information about the survey
        var surveyCollection = mdb.GetCollection<BsonDocument>("surveys");
        var filter = BsonDocument.Parse("{'general.surveyID': '" + surveyId + "'}");
        var survey = surveyCollection.Find(filter).FirstOrDefault();
        if (survey == null) return StatusCode(409);

        // The number of questions in the survey
        int questionCount = survey["widgets"].AsBsonArray.Count;

        // Gets all the responses for the survey
        var responseCollection = mdb.GetCollection<Response>("responses");
        var responses = responseCollection.Aggregate()
        .Match(new BsonDocument {{ "SurveyID", surveyId }, {"Year", year}, {"Month", month}, {"Day", day}}).ToList();

        // Calculates scores used in the survey summary
        int numberOfCompleted = 0;
        int totalQuestionsAnswered = 0;
        foreach (var response in responses) {
            totalQuestionsAnswered += response.Responses.Count;
            if (response.Responses.Count == questionCount) {
                numberOfCompleted++;
            }
        }

        // Survey summary variables
        int numberOfResponses = responses.Count();
        double completePercentage = (numberOfCompleted/(double)numberOfResponses)*100.0;
        if (numberOfResponses < 1) completePercentage = 0.0;
        double completenessFactor = totalQuestionsAnswered/(double)(numberOfResponses*questionCount);
        if (numberOfResponses < 1 || questionCount < 1) completenessFactor = 0.0;

        // Building up the array of documents containing the information about the questions
        BsonArray widgetArray = new BsonArray();
        var widgets = survey["widgets"].AsBsonArray;
        foreach (var widget in widgets)
        {
            BsonArray answerList = new BsonArray();
            switch (widget["type"].AsString)
            {
                case "Smiley":
                for (int i = 0; i < 4; i++) {

                    // Generates colors for the smiley widget graph
                    string color = "#000000";
                    switch (i) {
                        case 0: color = "#FF0000"; break;
                        case 1: color = "#00FF00"; break;
                        case 2: color = "#0000FF"; break;
                        case 3: color = "#FFFF00"; break;
                    }

                    answerList.Add(new BsonDocument{
                        {"id", i},
                        {"text", widget["subtitle" + (i + 1).ToString()].AsString},
                        {"color", color},
                        {"countPerHour", CountsPerHour(surveyId, widget["widgetID"].AsString, i.ToString(), year, month, day)
                    }});
                }
                break;
                case "Question":
                foreach (var answer in widget["answerList"].AsBsonArray) {

                    int id = answer["responseID"].AsInt32;
                    answerList.Add(new BsonDocument{
                        {"id", id},
                        {"text", answer["answerText"].AsString},
                        {"color", answer["buttonColor"].AsString},
                        {"countPerHour", CountsPerHour(surveyId, widget["widgetID"].AsString, id.ToString(), year, month, day)
                    }});
                }
                break;
            }
            
            BsonDocument widgetDocument = new BsonDocument{
                {"widgetId", widget["widgetID"]},
                {"title", widget["title"]},
                {"type", widget["type"]},
                {"answerList", answerList}
            };
            widgetArray.Add(widgetDocument);
            
        }

        // Building up the final result to return to the client
        BsonDocument result = new BsonDocument
        {
            {
                "summary", new BsonDocument
                {
                    {"nrOfResponses", numberOfResponses},
                    {"completePercentage", completePercentage},
                    {"completenessFactor", completenessFactor}
                }
            },
            {
                "questions", widgetArray
            }
        };
        var jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
        return Ok(result.ToJson(jsonWriterSettings));
    }

    // Gets an array that describes how many answers there are for a specific survey, widget and option per hour
    private BsonArray CountsPerHour(string surveyId, string widgetId, string responseId, int year, int month, int day) {
        
        var responseCollection = mdb.GetCollection<Response>("responses");
        var countsPerHour = responseCollection.Aggregate()
        .Match(new BsonDocument {{"SurveyID", surveyId}, {"Year", year}, {"Month", month}, {"Day", day}})
        .Unwind(x => x.Responses)
        .Match(new BsonDocument {{"responses.widgetID", widgetId}, {"responses.responseID", responseId}})
        .Group(new BsonDocument{{"_id", new BsonDocument{{"hour", "$Hours"}} }, {"count", new BsonDocument{{"$sum", 1}} }})
        .Project(new BsonDocument{{"hour", "$_id.hour"}, {"count", 1}, {"_id", 0}}).ToList();
        
        // Add the hours that does not have any responses
        List<int> hours = Enumerable.Range(0, 24).ToList();
        var countList = new List<BsonDocument>();
        foreach(var hour in hours){
            countList.Add(new BsonDocument{{"hour", hour}, {"count", 0}});
        }
        foreach( var item in countsPerHour){
            countList[item["hour"].AsInt32] = item;
        }
        /* 
        foreach (var items in countsPerHour) {
            hours.Remove(items["hour"].AsInt32);
        }
        foreach (var hour in hours) {
            countsPerHour.Add(new BsonDocument{{"hour", hour}, {"count", 0}});
        }
        */
        return new BsonArray(countList);
    }

    [HttpGet]
    [Route("test")]
    public ActionResult Test()
    {
        return new EmptyResult();
    }
}