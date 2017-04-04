using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Data;

namespace Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {

        Data.ApplicationDbContext db;

        public SampleDataController(ApplicationDbContext db){
            this.db = db;
        }

        [HttpGet("[action]")]
        public IEnumerable<Models.Responce> CustomerResponses()
        {

            var reps = db.Reponces.AsQueryable().ToList();

            return reps;
        }


    }
}
