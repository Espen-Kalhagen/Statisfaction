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
using Microsoft.AspNetCore.Authorization;

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
        [Authorize]
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
        [Authorize]
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
        [Authorize]
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
        [Authorize]
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
        [Authorize]
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
        [Authorize]
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
            
            // The collection containing surveys
            var collection = mongodb.GetCollection<BsonDocument>("surveys");
            // Update in production to stop editing
            var filter = Builders<BsonDocument>.Filter.Eq("general.surveyID", data.surveyID);
            var update = Builders<BsonDocument>.Update.Set("general.inProduction", true);
            collection.UpdateOne(filter, update);


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
        [Authorize]
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
        [Authorize]
        [Route("getSurveys/{id}")]
        [HttpGet("{id}")]
        public string getSurveys(string id)
        {
            var collection = mongodb.GetCollection<BsonDocument>("surveys");

            var filter = Builders<BsonDocument>.Filter.Eq("general.ownerID", id);

            List<MongoDB.Bson.BsonDocument> result = collection.Find(filter).ToList();

            var jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            return result.ToJson(jsonWriterSettings);
        }
        [Authorize]
        [Route("getTemplates")]
        [HttpGet]
        public string getTemplates()
        {
            var collection = mongodb.GetCollection<BsonDocument>("surveys");

            var filter = Builders<BsonDocument>.Filter.Eq("general.ownerID", "TEMPLATE");

            List<MongoDB.Bson.BsonDocument> result = collection.Find(filter).ToList();

            var jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            return result.ToJson(jsonWriterSettings);

        }

        /**
         * Get survey by SurveyID
         * Example: http://localhost:5000/api/UnitSetup/survey/a3a841d0-9257-495c-832e-0adc424b17wq
         */
        [Authorize]
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

        [Authorize]
        [Route("survey")]
        [HttpPost]
        public IActionResult postSurvey([FromBody] JObject survey)
        {

            var collection = mongodb.GetCollection<BsonDocument>("surveys");
            var surveyDocument = BsonDocument.Parse(survey.ToString());

            collection.InsertOne(surveyDocument);

            return Ok(survey);

        }

        /**
         * Saves the given survey to MongoDB
         * If the given survey does not exist, it will save a new one.
         * Used to both edit existing surveys and save new ones
         */
        [Authorize]
        [Route("saveSurvey")]
        [HttpPost]
        public IActionResult saveSurvey([FromBody] JObject survey)
        {

            // The collection containing surveys
            var collection = mongodb.GetCollection<BsonDocument>("surveys");

            var surveyID = survey["general"]["surveyID"];

            // An apropriate filter so that we can find the correct survey
            var filter = Builders<BsonDocument>.Filter.Eq("general.surveyID", surveyID.ToString());

            var currentDocument = collection.Find(filter).FirstOrDefault();


            if(currentDocument == null)
            {
                this.postSurvey(survey);
                return Ok(survey);
            }


            var currentID = currentDocument["_id"];

            // A new BsonDocument that replaces the old document
            var newDocument = BsonDocument.Parse(survey.ToString());

            newDocument["_id"] = currentID;

            var result2 = collection.ReplaceOne(filter, newDocument);

            return Ok(survey);
        }


        /**
        Delete survey with suveryID id
        Example:
        http://localhost:5000/api/UnitSetup/deleteSurvey/a3a841d0-9257-495c-832e-0adc424b17ea
        */
        //will fail at routing if this is called survey/{id} which is weird since it is HttpDelete and the other is HttpGet...
        [Authorize]
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
        [Authorize]
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

