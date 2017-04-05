/**
    This controller serves a webpage to start a new MQ reader.
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Data;
using Services;
using MongoDB.Driver;

namespace Controllers
{

    public class StoreUnitController : Controller
    {
        //Must use this for db to not get disposed after request finishes
        
        IMongoService mongoService ;

        public StoreUnitController(IMongoService mongoService){
            this.mongoService = mongoService;
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
            var worker = new RabbitMQTasks.Worker(mongoService);
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
