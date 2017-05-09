/**
This is an api that handels setup and configuration of the store unit
 */
 using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace api.UnitSetup
{

    [Route("api/[controller]")]
    public class UnitSetup : Controller
    {
        private ApplicationDbContext db;
        private UserManager<ApplicationUser> um;
        public UnitSetup(ApplicationDbContext db, UserManager<ApplicationUser> um)
        {
            this.db = db;
            this.um = um;
        }

        [Route("registerNewUnit")]
        [HttpPost]
        public IActionResult Post([FromBody]RegistrationData data)
        {

            var unitQ = from i in db.StoreUnits.Include(p => p.Owner)
                          where i.RegistationPin == data.pin
                          select i;

            StoreUnit unit = null;
            try{
            unit = unitQ.ToList().First();
            }catch{
                return NotFound();
            }
            
            if(unit.Confirmed){
                return StatusCode(409); //409 conflict
            }
            unit.Confirmed = true;
            db.SaveChanges();
            //activation was successfull

            return Json(new StoreUnitViewModel(unit));
        }
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
        Get all unis registered to email (id)
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
        Post a new survey to a unit
         */
        [Route("UnitSurvey")]
        public IActionResult post([FromBody]SurveyUnitData data)
        {
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
            db.SaveChanges();
            return Json(unit);
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
    }


}

