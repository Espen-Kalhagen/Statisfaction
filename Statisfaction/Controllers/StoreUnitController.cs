using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Statisfaction.Data;

namespace Statisfaction.Controllers
{
    public class StoreUnitController : Controller
    {
        //Must use this for db to not get disposed after request finishes
        DbContextOptions<ApplicationDbContext> db;

        public StoreUnitController(DbContextOptions<ApplicationDbContext> db){
            this.db = db;
        }
        //Inputing data in the form will produce a rabbitMQ message
        public IActionResult Index()
        {   

            return View();
        }
        //Start a worker that consumes rabbitMQ messages (Writes them to the console), consumes everything in the queue and stays alive 
        //Having more wokrers spilits the work between the workers (round robin)
        //probably a good idea to find a more elegant way to start a new worker
        public IActionResult Read()
        {
            var worker = new RabbitMQTasks.Worker(db);
            System.Threading.Thread myThread;
            myThread = new System.Threading.Thread(new
                System.Threading.ThreadStart(worker.StartRead)); 

            myThread.Start();
             ViewBag.WorkerStatus = "Started worker";
                
            return View("Index");
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
