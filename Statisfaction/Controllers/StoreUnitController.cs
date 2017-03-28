using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Statisfaction.Data;

namespace Statisfaction.Controllers
{
    public class StoreUnitController : Controller
    {

        ApplicationDbContext db;

        public StoreUnitController(ApplicationDbContext db){
            this.db = db;
        }
        //Inputing data in the form will produce a rabbitMQ message
        public IActionResult Index()
        {   

            return View();
        }
        //A sample post is created by calling this
        public IActionResult Post()
        {
            new RabbitMQTasks.NewTask();
            return View("Index");
        }
        //Start a worker that consumes rabbitMQ messages (Writes them to the console), consumes everything in the queue and stays alive 
        //Having more wokrers spilits the work between the workers (round robin)
        //probably a good idea to find a more elegant way to start a new worker
        public IActionResult Read()
        {
            new RabbitMQTasks.Worker(db);
            return View("Index");
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
