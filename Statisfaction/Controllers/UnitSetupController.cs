/**
This is an api that handels setup and configuration of the store unit
 */
using System;
using System.Linq;
using System.Threading.Tasks;
using Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

using Services;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.IO;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;
using RabbitMQ.Client;
using System.Text;
using Newtonsoft.Json.Linq;

namespace api.UnitSetup
{

    [Route("api/[controller]")]
    public class UnitSetup : Controller
    {

        private ApplicationDbContext db;
        private UserManager<ApplicationUser> um;
        private IMongoDatabase mongodb;
        public UnitSetup(ApplicationDbContext db, UserManager<ApplicationUser> um, IMongoService mongoService)
        {
            this.db = db;
            this.um = um;
            this.mongodb = mongoService.GetMongo();
        }

        /**
        After a unit has been created, it needs to be bound to a physical store unit, this is done here
         */
        [Route("register")]
        [HttpPost]
        public IActionResult Post([FromBody]RegistrationData data)
        {

            var unitQ = from i in db.StoreUnits.Include(p => p.Owner)
                        where i.RegistationPin == data.pin
                        select i;

            StoreUnit unit = null;
            try
            {
                unit = unitQ.ToList().First();
            }
            catch
            {
                return NotFound();
            }

            if (unit.Confirmed)
            {
                return StatusCode(409); //409 conflict
            }
            unit.Confirmed = true;
            db.SaveChanges();
            //activation was successfull

            return Json(new StoreUnitViewModel(unit));
        }
        /**
        Unbind a physical store unit from a unit
         */
        [Route("unregister")]
        [HttpPost]
        public IActionResult unbind([FromBody]RegistrationData data)
        {
            var unitQ = from i in db.StoreUnits.Include(p => p.Owner)
                        where i.RegistationPin == data.pin
                        select i;

            StoreUnit unit = null;
            try
            {
                unit = unitQ.ToList().First();
            }
            catch
            {
                return NotFound();
            }

            if (!unit.Confirmed)
            {
                return StatusCode(409); //409 conflict
            }
            unit.Confirmed = false;
            db.SaveChanges();
            //activation was successfull

            //Publish a rabbit message telling the store unit to refresh
            refreshStoreUnit(unit.id);

            return Json(new StoreUnitViewModel(unit));
        }

        /**
        Each time a physical store unit loads the site, it needs to check that it is registered with this device
         */
        [Route("checkRegistration")]
        [HttpPost]
        public IActionResult Post([FromBody]ActivationData data)
        {

            var unitQ = from i in db.StoreUnits.Include(p => p.Owner)
                        where i.id == data.Unitid
                        select i;

            StoreUnit unit = null;
            try
            {
                unit = unitQ.ToList().First();
            }
            catch
            {
                return NotFound();
            }

            db.SaveChanges();
            //activation was successfull

            return Json(new StoreUnitViewModel(unit));
        }


        /**
        Get all unis registered to OwnerID (id)
         */
        [Route("units/{id}")]
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {

            var unitQ = from i in db.StoreUnits
                        where i.Owner.Id == id
                        select i;
            List<StoreUnit> units;
            try
            {
                units = unitQ.ToList();
            }
            catch
            {
                return NotFound();
            }
            return Json(units);

        }

        /**
        Delete store unit by unitID
        */
        [Route("unit/{id}")]
        [HttpDelete("{id}")]
        public IActionResult deleteUnit(int id)
        {
            var unitQ = from i in db.StoreUnits
                        where i.id == id
                        select i;
            StoreUnit unit;
            try
            {
                unit = unitQ.ToList().First();
            }
            catch
            {
                return NotFound();
            }
            db.StoreUnits.Remove(unit);
            db.SaveChanges();

            //Publish a rabbit message telling the store unit to refresh
            refreshStoreUnit(id);
            return Json(unit);
        }

        /**
        Bind a new survey to a unit, also sends a message to the storeunit telling it to  change to the new survey
        Example:
        http://localhost:5000/api/UnitSetup/bindSurvey
         */
        [Route("bindSurvey")]
        public IActionResult post([FromBody]SurveyUnitData data)
        {
            //Update database
            var unitQ = from i in db.StoreUnits
                        where i.id == data.Unitid
                        select i;

            StoreUnit unit;
            try
            {
                unit = unitQ.ToList().First();
            }
            catch
            {
                return NotFound();
            }
            unit.SurveyID = data.surveyID;
            unit.SurveyName = data.surveyName;
            db.SaveChanges();

            //Publish a rabbit message telling the store unit to refresh
            refreshStoreUnit(data.Unitid);

            return Json(unit);
        }
        /**
        Get available surveys for user id
        Example:
        'http://localhost:5000/api/UnitSetup/surveys/' + OwnerID

        See survey-selector for more detailed example
        */
        [Route("surveys/{id}")]
        [HttpGet("{id}")]
        public string get(string id)
        {
            //TestData
            /* 
            List<SurveyData> surveys = new List<SurveyData>();
            surveys.Add( new SurveyData {surveyName = "Default", surveyID = "5" });
            surveys.Add(new SurveyData { surveyName = "Price survey", surveyID = "10" });
            surveys.Add(new SurveyData { surveyName = "Satisfaction survey", surveyID = "20" });
            return Json(surveys);
            */
            var collection = mongodb.GetCollection<BsonDocument>("surveys");

            var filter = Builders<BsonDocument>.Filter.Eq("general.ownerID", id);
            var defaultsFilter = Builders<BsonDocument>.Filter.Eq("general.ownerID", "ALL");

            List<MongoDB.Bson.BsonDocument> result = collection.Find(defaultsFilter).ToList();
            result.AddRange(collection.Find(filter).ToList());


            var jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            return result.ToJson(jsonWriterSettings);

        }

        /**
        Get survey by SurveyID
        Example:
        http://localhost:5000/api/UnitSetup/survey/a3a841d0-9257-495c-832e-0adc424b17wq
        */
        [Route("survey/{id}")]
        [HttpGet("{id}")]
        public string getSurvey(string id)
        {


            var collection = mongodb.GetCollection<BsonDocument>("surveys");
            var filter = Builders<BsonDocument>.Filter.Eq("general.surveyID", id);
            //var filter = new BsonDocument();

            var result = collection.Find(filter).FirstOrDefault();


            var jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            return result.ToJson(jsonWriterSettings);
        }

        /**
        Post survey 
        Example:
            http://localhost:5000/api/UnitSetup/survey
            Body:
                {
    "general": {
        "ownerID": "ALL",
        "surveyID": "a3a841d0-9257-495c-832e-0adc424b17wq",
        "title": "TEST",
        "description": "Only smileys",
        "color": "#a64040",
        "logoUrl": "",
        "timeoutDelay": 8
    },
    "widgets": [
        {
            "widgetID": "4c991cd5-984a-4499-98b5-795750fa0212",
            "type": "Smiley",
            "title": "Was the experience enjoyable?",
            "subtitle1": "Subtitle 1",
            "subtitle2": "Subtitle 2",
            "subtitle3": "Subtitle 3",
            "subtitle4": "Subtitle 4"
        }
    ],
    "thankYou": {
        "delay": "6",
        "message": "Thank you!"
    }
}
        */
        [Route("survey")]
        [HttpPost]
        public IActionResult postSurvey([FromBody] JObject survey)
        {

            var collection = mongodb.GetCollection<BsonDocument>("surveys");
            var surveyDocument = BsonDocument.Parse(survey.ToString());

            collection.InsertOne(surveyDocument);

            return Ok(survey);

        }

        [Route("editSurvey")]
        [HttpPost]
        public IActionResult editSurvey([FromBody] JObject survey)
        {

            // The collection containing surveys
            var collection = mongodb.GetCollection<BsonDocument>("surveys");

            // The id of the survey that are being replaced
            var surveyID = survey["_id"];

            // An apropriate filter so that we can find the correct survey
            var filter = Builders<BsonDocument>.Filter.Eq("_id", surveyID.First);

            // A new BsonDocument that replaces the old document
            var newDocument = BsonDocument.Parse(survey.ToString());

            // Replace the old document with the new!
            //var result = collection.ReplaceOne(filter, newDocument);
            var result = collection.ReplaceOne(e => e["_id"] == newDocument["_id"], newDocument);
            
            return Ok(survey);
        }


        /**
        Delete survey with suveryID id
        Example:
        http://localhost:5000/api/UnitSetup/deleteSurvey/a3a841d0-9257-495c-832e-0adc424b17ea
        */
        //will fail at routing if this is called survey/{id} which is weird since it is HttpDelete and the other is HttpGet...
        [Route("deleteSurvey/{id}")]
        [HttpDelete("{id}")]
        public IActionResult deleteSurvey(string id)
        {

            var collection = mongodb.GetCollection<BsonDocument>("surveys");
            var filter = Builders<BsonDocument>.Filter.Eq("general.surveyID", id);
            var result = collection.Find(filter).FirstOrDefault();
            collection.DeleteOne(filter);


            //Refresh all owners store units, in case they were using this survey
            var ownerID = result["general"]["ownerID"].AsString;

            var unitQ = from i in db.StoreUnits
                        where i.Owner.Id == ownerID
                        select i;
            List<StoreUnit> units = null;
            try
            {
                units = unitQ.ToList();
            }
            catch
            {
                Console.WriteLine("failed at refreshing store units");
                return Ok();
            }
            foreach (var unit in units)
            {
                refreshStoreUnit(unit.id);
            }

            return Ok();
        }
        [Route("addUnit")]
        [HttpPost]
        public IActionResult addUnit([FromBody]Models.StoreUnit newUnit){

            if (ModelState.IsValid)
            {
                var currentUser = um.FindByIdAsync(newUnit.OwnerID).Result;

                newUnit.RegistationTime = DateTime.Now;
                newUnit.Owner = currentUser;
                newUnit.Confirmed = false;

                int newUnitPin = -1;
                Random random = new Random();
                //Check that pin is unused:
                var exists = true;
                while (exists)
                {
                    newUnitPin = random.Next(10000, 99999);
                    var oldUnit = from i in db.StoreUnits
                                  where i.RegistationPin == newUnitPin
                                  select i;
                    if (!oldUnit.ToList().Any())
                    {
                        exists = false;
                    }

                }

                newUnit.RegistationPin = newUnitPin;

                db.StoreUnits.Add(newUnit);
                db.SaveChanges();
            }

        return(Json(newUnit));
        }

        private void refreshStoreUnit(int UnitID)
        {

            var factory = new ConnectionFactory() { HostName = "rabbitmq.statisfaction.tech", Password = "unituser", UserName = "unituser" };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "StoreUnitQueue:" + UnitID,
                                     durable: true,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);


                var body = Encoding.UTF8.GetBytes("SurveyIDUpdate");

                var properties = channel.CreateBasicProperties();
                properties.Persistent = true;
                channel.BasicPublish(exchange: "",
                         routingKey: "StoreUnitQueue:" + UnitID,
                         basicProperties: properties,
                         body: body);
            }

        }


    }



    public class RegistrationData
    {
        public int pin { get; set; }
    }
    public class ActivationData
    {
        public int Unitid { get; set; }
        public string ownerID { get; set; }
    }
    public class SurveyUnitData
    {
        public int Unitid { get; set; }
        public string surveyID { get; set; }
        public string surveyName { get; set; }
    }
    public class SurveyData
    {
        public string surveyName { get; set; }
        public string surveyID { get; set; }
        public string content { get; set; }

    }


}

