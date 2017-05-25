using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models;

using System.IO;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Models.AccountViewModels;
using Services;
using System.Net.Http;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.IO;
using Newtonsoft.Json.Serialization;
using RabbitMQ.Client;
using System.Text;
using Newtonsoft.Json.Linq;

using Stripe;

namespace Controllers
{

    public class AuthController : Controller
    {

        private ApplicationDbContext db;
        private UserManager<ApplicationUser> um;
        private SignInManager<ApplicationUser> sm;

        public AuthController(ApplicationDbContext db, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            this.db = db;
            this.um = userManager;
            this.sm = signInManager;
        }

        public IActionResult Index()
        {

            if(User.Identity.IsAuthenticated)
            {
                return Redirect("client");
            }

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



        //
        // POST: /Account/Subscribe
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Subscribe([FromBody] JObject data)
        {

            var email = data["email"].ToString();
            var token = data["token"].ToString();
            var tokenID = data["tokenID"].ToString();
            var password = data["password"].ToString();

            var user = new ApplicationUser { UserName = email, Email = email };
            var result = await this.um.CreateAsync(user, password);


            if (result.Succeeded == false)
            {
                AddErrors(result);
                return StatusCode(520,result);
            }

            var customer = new StripeCustomerCreateOptions();
            customer.Email = email;
            customer.SourceToken = tokenID;
            customer.PlanId = "default";
            customer.Quantity = 1;

            var customerService = new StripeCustomerService();

            StripeCustomer stripeCustomer = customerService.Create(customer);
            Console.WriteLine("Customer get created: " + stripeCustomer.Created);

            if(stripeCustomer == null)
            {
                await this.um.DeleteAsync(user);
                AddErrors(result);
                return StatusCode(520,result);
            }

            await sm.SignInAsync(user, isPersistent: false);
            
            Console.WriteLine("User created a new account with password.");
            return Ok();
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }



    }
}