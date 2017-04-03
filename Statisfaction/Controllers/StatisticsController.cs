using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    
    public class StatisticsController : Controller
    {
        [Authorize]
        public IActionResult Index()
        {
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