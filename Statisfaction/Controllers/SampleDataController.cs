using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Data;

using Services;
using MongoDB.Driver;
using MongoDB.Bson;

namespace Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {

        IMongoDatabase db ;

        public SampleDataController(IMongoService mongoService){
            this.db = mongoService.GetMongo();
        }

        [HttpGet("[action]")]
        public JsonResult CustomerResponses()
        {

            var collection = db.GetCollection<BsonDocument>("responses");

            var responses = collection.Find(new BsonDocument()).ToList().ToJson();

            Console.WriteLine(responses);

            return new JsonResult(responses);
        }


    }
}
