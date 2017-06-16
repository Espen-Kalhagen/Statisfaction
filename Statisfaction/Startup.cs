using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Models;
using Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Services;
using Microsoft.AspNetCore.Identity;
using Stripe;
using Microsoft.AspNetCore.Rewrite;

namespace WebApplicationBasic
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.

            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite("Filename=./database/Statisfaction.db"));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddMvc();

            // Add application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();

            // Adds the custom mongo-service as as scoped service
            services.AddScoped<IMongoService, MongoService>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var db = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();
                var mongoService = serviceScope.ServiceProvider.GetService<IMongoService>();

                var userManager = serviceScope.ServiceProvider.GetService<UserManager<ApplicationUser>>();



                var worker = new RabbitMQTasks.Worker(mongoService);
                System.Threading.Thread myThread;
                myThread = new System.Threading.Thread(new
                    System.Threading.ThreadStart(worker.StartRead));

                myThread.Start();

            // Initialize stripe
            StripeConfiguration.SetApiKey("sk_test_eQr4p9hfcoToDBtJoL7rXisg");

            if (env.IsDevelopment())
             {
                db.Database.EnsureDeleted();
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
            {
                HotModuleReplacement = true
            });
             }else{
                 app.UseExceptionHandler("/Home/Error");
             }

             db.Database.EnsureCreated();
            }
            
            //Https redirection rules
            app.UseRewriter(new RewriteOptions().Add(new RedirectRules()));

            app.UseStaticFiles();

            app.UseIdentity();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapRoute(
                    name: "spa-store-unit",
                    template: "store-unit",
                    defaults: new { controller = "Console", action = "StoreUnit" });

                routes.MapRoute(
                    name: "spa-register-unit",
                    template: "register-unit",
                    defaults: new { controller = "Console", action = "StoreUnit" });

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Console", action = "Index" });

                routes.MapRoute(
                    name: "spa-auth",
                    template: "auth",
                    defaults: new { controller = "Auth", action = "Register" });

            });
        }
    }
}
