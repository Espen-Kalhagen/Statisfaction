
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Microsoft.AspNetCore.Authorization;

using Services;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.IO;
using Newtonsoft.Json.Serialization;

namespace api.Survey
{

    [Route("api/SurveyController")]
    public class SurveyController : Controller
    {

        // Reference to the application database (SQL)
        private ApplicationDbContext db;

        // Reference to the user manager
        private UserManager<ApplicationUser> um;

        // A reference to the MongoDB (NoSQL)
        IMongoDatabase mdb ;

        public SurveyController(ApplicationDbContext db, UserManager<ApplicationUser> um, IMongoService mongoService)
        {
            this.db = db;
            this.um = um;
            this.mdb = mongoService.GetMongo();
        }

        [HttpPost]
        public IActionResult SaveSurvey(string payload)
        {
            Console.WriteLine("Payload: " +  payload);

            var currentUser = um.FindByNameAsync(User.Identity.Name).Result;

            // Get the response collection
            var collection = mdb.GetCollection<BsonDocument>("survey-test");


            var document = BsonDocument.Create(payload);
        

            document["ownerID"] = currentUser.Id;

            collection.InsertOne(document);

            return Content("Hello World!");
        }

    }
}

