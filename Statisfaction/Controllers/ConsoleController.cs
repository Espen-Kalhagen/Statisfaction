using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace Controllers
{
    
    public class ConsoleController : Controller
    {

        private ApplicationDbContext db;
        private UserManager<ApplicationUser> um;
        public ConsoleController(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            this.db = db;
            this.um = userManager;
        }
        [Authorize]
        public IActionResult Index()
        {
            var currentUser = um.FindByNameAsync(User.Identity.Name).Result;
            if (currentUser == null) {
                return View("~/Views/Home/Index.cshtml");
            }
            ViewBag.ID = currentUser.Id;
            return View();
        }

        public IActionResult StoreUnit()
        {
            return PartialView("Index");
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}