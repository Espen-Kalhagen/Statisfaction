using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Data;
using Models;
using Microsoft.AspNetCore.Authorization;

namespace Controllers
{
    public class HomeController : Controller
    {

        private ApplicationDbContext db;
        private UserManager<ApplicationUser> um;
        public HomeController(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            this.db = db;
            this.um = userManager;
        }
        
        public IActionResult Index()
        {
            return View();
        }

        [Authorize]
        [HttpGet]
        public IActionResult AddUnit()
        {


            return View();

        }
        [Authorize]
        [HttpPost]
        public IActionResult AddUnit(Models.StoreUnit newUnit)
        {
            if (ModelState.IsValid)
            {
                var currentUser = um.FindByNameAsync(User.Identity.Name).Result;

                newUnit.RegistationTime = DateTime.Now;
                newUnit.Owner = currentUser;
                newUnit.Confirmed = false;

                int newUnitPin=-1;
                Random random = new Random();
                //Check that pin is unused:
                var exists = true;
                while(exists){
                    newUnitPin = random.Next(10000, 99999);
                    var oldUnit  = from i in db.StoreUnits
                          where i.RegistationPin == newUnitPin
                          select i;
                    if(!oldUnit.ToList().Any()){
                        exists = false;
                    }

                }

                newUnit.RegistationPin = newUnitPin;
                ViewBag.NewUnitPin = newUnitPin;

                db.StoreUnits.Add(newUnit);
                db.SaveChanges();
            }

            return View("ConfirmAddUnit");

        }

            public IActionResult Error()
        {
            return View();
        }
    }
}
