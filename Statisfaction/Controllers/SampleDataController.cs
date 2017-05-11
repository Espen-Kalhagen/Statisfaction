using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Data;
using Models;

using Services;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.IO;
using Newtonsoft.Json.Serialization;

namespace Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {

        // A reference to the MongoDB
        IMongoDatabase db ;

        
        // Dependency injects the mongoService 
        public SampleDataController(IMongoService mongoService){
            this.db = mongoService.GetMongo();
        }

        // Gets all responses (for every user)
        // This is only for test-purposes
        [HttpGet("[action]")]
        public string CustomerResponses()
        {

            // Get the response collection
            var collection = db.GetCollection<BsonDocument>("responses");
            // Get all documents in the collection
            var result = collection.Find(new BsonDocument()).ToList();

            // IMPORTANT! The json-writer settings must be configured to strict in order to correctly create a valid Json
            // response for the client
            var jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            
            // Return the retrieved data to the client
            return result.ToJson(jsonWriterSettings);
        }


    }



}
