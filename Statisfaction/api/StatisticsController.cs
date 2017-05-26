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
    // URI: api/statistics/unit/1?date=1993/01/01&from=0&to=23
    public ActionResult QuestionStatistics(int unitId, string date, int from=0, int to=23)
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

        // Finds the survey ids that have responses for the selected day
        List<string> surveyIds = mdb.GetCollection<Response>("responses")
        .Distinct<string>("SurveyID", new BsonDocument{{"UnitID", unitId}, {"Day", day}, {"Month", month}, {"Year", year}}).ToList();

        // Summary variables that are updated for each survey
        int numberOfCompleted = 0;
        int totalQuestionsAnswered = 0;
        int totalNumberOfResponses = 0;
        int totalQuestionCount = 0;

        // Building up the array of documents containing the information about the questions
        BsonArray widgetArray = new BsonArray();
        foreach (var surveyId in surveyIds)
        {
            // Gets information about the survey
            var surveyCollection = mdb.GetCollection<BsonDocument>("surveys");
            var filter = BsonDocument.Parse("{'general.surveyID': '" + surveyId + "'}");
            var survey = surveyCollection.Find(filter).FirstOrDefault();
            if (survey == null) return StatusCode(409);

            // Gets all the responses for the survey
            var responseCollection = mdb.GetCollection<Response>("responses");
            var responses = responseCollection.Aggregate()
            .Match(new BsonDocument {{ "UnitID", unitId }, { "SurveyID", surveyId }, {"Year", year}, {"Month", month}, {"Day", day}}).ToList();

            // Updates summary variables with data from this survey
            int questionCount = survey["widgets"].AsBsonArray.Count;
            int numberOfResponses = responses.Count();
            totalNumberOfResponses += numberOfResponses;
            totalQuestionCount += questionCount*responses.Count();
            foreach (var response in responses) {
                totalQuestionsAnswered += response.Responses.Count;
                if (response.Responses.Count == questionCount) {
                    numberOfCompleted++;
                }
            }

            // Loops through the widgets in the survey
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
                            {"id", i.ToString()},
                            {"text", widget["subtitle" + (i + 1).ToString()].AsString},
                            {"color", color},
                            {"countPerHour", CountsPerHour(unitId, surveyId, widget["widgetID"].AsString, (i + 1).ToString(), year, month, day, from, to)
                        }});
                    }
                    break;
                    case "Question":
                    foreach (var answer in widget["answerList"].AsBsonArray) {

                        string id = answer["responseID"].AsInt32.ToString();
                        answerList.Add(new BsonDocument{
                            {"id", id},
                            {"text", answer["answerText"].AsString},
                            {"color", answer["buttonColor"].AsString},
                            {"countPerHour", CountsPerHour(unitId, surveyId, widget["widgetID"].AsString, id.ToString(), year, month, day, from, to)
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
        }
        
        // Calculate summary results
        double completePercentage = (numberOfCompleted/(double)totalNumberOfResponses)*100.0;
        if (totalNumberOfResponses < 1) completePercentage = 0.0;
        double completenessFactor = totalQuestionsAnswered/(double)totalQuestionCount;
        if (totalNumberOfResponses < 1 || totalQuestionCount < 1) completenessFactor = 0.0;

        // Building up the final result to return to the client
        BsonDocument result = new BsonDocument
        {
            {
                "summary", new BsonDocument
                {
                    {"nrOfResponses", totalNumberOfResponses},
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
    private BsonArray CountsPerHour(int unitId, string surveyId, string widgetId, string responseId, int year, int month, int day, int from, int to) {
        
        var responseCollection = mdb.GetCollection<Response>("responses");
        var countsPerHour = responseCollection.Aggregate()
        .Match(new BsonDocument {{"UnitID", unitId}, {"SurveyID", surveyId}, {"Year", year}, {"Month", month}, {"Day", day}})
        .Unwind(x => x.Responses)
        .Match(new BsonDocument {{"responses.widgetID", widgetId}, {"responses.responseID", responseId}})
        .Group(new BsonDocument{{"_id", new BsonDocument{{"hour", "$Hours"}} }, {"count", new BsonDocument{{"$sum", 1}} }})
        .Project(new BsonDocument{{"hour", "$_id.hour"}, {"count", 1}, {"_id", 0}}).ToList();
        
        // Compiles a list of hour/count pairs between the specified interval
        List<int> hours = Enumerable.Range(from, to - from + 1).ToList();
        var countList = new List<BsonDocument>();
        for (int i = from; i <= to; i++) {
            var element = countsPerHour.SingleOrDefault(c => c["hour"].AsInt32 == i);
            if (element == null) {
                countList.Add(new BsonDocument{{"hour", i}, {"count", 0}});
            } else {
                countList.Add(new BsonDocument{{"hour", element["hour"].AsInt32}, {"count", element["count"].AsInt32}});
            }
        }
        
        return new BsonArray(countList);
    }

    [HttpGet]
    [Route("test")]
    public ActionResult Test()
    {
        return new EmptyResult();
    }
}