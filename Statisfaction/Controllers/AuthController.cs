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

    public class AuthController : Controller
    {

        private ApplicationDbContext db;
        private UserManager<ApplicationUser> um;

        public AuthController(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            this.db = db;
            this.um = userManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Auth()
        {
            return PartialView("Index");
        }

        public IActionResult Register()
        {
            return PartialView("Index");
        }

        public IActionResult Error()
        {
            return View();
        }


    }
}